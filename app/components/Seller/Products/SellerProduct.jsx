"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FaUpload } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";

const SellerProduct = ({
  product,
  sellerId,
  productFullViewHandler,
  setSelectedProduct,
}) => {
  const { _id, title, category, variants } = product || {};
  const queryClient = useQueryClient();
  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `/auth/seller/products/product?productId=${_id}`
      );
      return response.data;
    },
    onMutate: () => {
      toast.loading("Product deleting...");
    },
    onSuccess: (data, variables, context) => {
      toast.dismiss(context);
      toast.success(data.message || "Product deleted");
      queryClient.invalidateQueries(["sellerProducts", sellerId]);
    },
    onError: (error, variables, context) => {
      toast.dismiss(context);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  return (
    <div className="w-full flex items-center gap-4 border-b py-3">
      {variants[0].images[0] && (
        <Image
          src={variants[0].images[0].url}
          alt="product image"
          width={100}
          height={100}
        />
      )}

      <div
        className="flex flex-col w-full cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setSelectedProduct(product);
          productFullViewHandler(true);
        }}
      >
        <p className="font-bold md:text-lg">{title}</p>
        <div className="flex items-center">
          <span className="font-bold md:text-lg">Category:</span>
          <span className=""> {category}</span>
        </div>
        <div className="w-full flex-wrap flex items-center">
          <span className="font-bold md:text-lg">Variants:</span>
          <div className="flex flex-wrap">
            {variants.map((variant) => (
              <div className="flex gap-2 items-center" key={variant.color}>
                [<span>{variant.color}</span>
                <div
                  className="w-3 h-3 rounded-full border border-black"
                  style={{ backgroundColor: variant.color }}
                ></div>
                ]
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end items-center gap-2">
        <Link href={`/seller/dashboard/${sellerId}/${_id}`}>
          <button className="px-5 py-2 text-lg bg-purple-700 hover:bg-purple-600 cursor-pointer text-white rounded-lg">
            <FaUpload />
          </button>
        </Link>
        <button
          onClick={mutateDelete}
          disabled={isDeletePending}
          className={
            isDeletePending
              ? "px-5 py-2 text-lg bg-red-400 cursor-pointer text-white rounded-lg"
              : "px-5 py-2 text-lg bg-red-500 hover:bg-red-400 cursor-pointer text-white rounded-lg"
          }
        >
          {isDeletePending ? "Deleting..." : "Delete"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default SellerProduct;
