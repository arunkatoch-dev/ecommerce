"use client";
import UseWhishlistQuery from "@/app/hooks/useWhishlistQuery";
import { MdDelete } from "react-icons/md";
import React from "react";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Whishlist = ({ user }) => {
  if (!user) {
    return <Error message="User ID not found" />;
  }
  const queryClient = useQueryClient();
  const {
    data: whishlistData,
    isLoading: whishlistLoading,
    isError: isWhishlistError,
  } = UseWhishlistQuery(user);

  const { mutate: deleteProductMutate, isLoading: isProductDeleting } =
    useMutation({
      mutationFn: async (productId) => {
        const response = await axios.delete(
          `/whishlist?productId=${productId}&userId=${user}`
        );
        return response.data;
      },
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message || "Something went wrong");
        } else {
          toast.success(data.message || "product removed from wishlist");
          queryClient.invalidateQueries(["userWhishlist", user]);
        }
      },
      onError: (error) => {
        console.error("Product remove error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
      },
    });

  if (whishlistLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <section className="w-full flex flex-col min-h-[80vh]">
      {whishlistData?.wishlist?.products?.length > 0 ? (
        <div className="w-full flex flex-col gap-3 p-5">
          {whishlistData.wishlist.products.map(({ product }) => {
            const { _id, title, price, variants } = product;
            return (
              <div
                className="w-full flex items-center gap-4 border-b py-3"
                key={_id}
              >
                {variants[0]?.images[0]?.url && (
                  <Image
                    src={variants[0].images[0].url}
                    alt={title}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                )}
                <Link href={`/topselling/${_id}`}>
                  <div className="flex flex-col w-full cursor-pointer">
                    <p className="font-bold text-lg">{title}</p>
                    <div className="flex items-center">
                      <span className="font-bold text-lg">Price:</span>
                      <span className="ml-2">&#8377; {price}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-lg">Colors:</span>
                      <div className="flex ml-2">
                        {variants.map((variant) => (
                          <div
                            className="flex gap-2 items-center"
                            key={variant.color}
                          >
                            <div
                              className="w-3 h-3 rounded-full border border-black"
                              style={{ backgroundColor: variant.color }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="w-full flex justify-end items-center gap-2">
                  <button
                    title="Remove from Wishlist"
                    disabled={isProductDeleting}
                    className={
                      isProductDeleting
                        ? "p-2 text-lg bg-red-300 cursor-not-allowed text-white rounded-lg"
                        : "p-2 text-lg bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-lg"
                    }
                    onClick={() => {
                      deleteProductMutate(_id);
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-[50vh] flex flex-col gap-5 items-center justify-center">
          <span className="text-red-600 text-2xl">
            Your wishlist is empty..
          </span>
          <Link
            href="/topselling"
            className="bg-black w-[95%] py-2 lg:py-0 mx-auto md:mx-0 my-5 lg:my-0 lg:w-[210px] lg:h-[52px] rounded-full text-white flex items-center justify-center text-base hover:bg-gray-800"
          >
            Add Items
          </Link>
        </div>
      )}
    </section>
  );
};

export default Whishlist;
