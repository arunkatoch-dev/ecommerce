"use client";
import React from "react";
import Image from "next/image";
import { AiFillDelete } from "react-icons/ai";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Alert from "../Alert/Alert";
import Link from "next/link";

const CartItems = ({ cart }) => {
  const queryClient = useQueryClient();

  const incrementQuantity = (userId, itemId, quantity) => {
    updateQuantity({ userId, itemId, quantity: quantity + 1 });
  };

  const decrementQuantity = (userId, itemId, quantity) => {
    if (quantity === 1) {
      toast.error("Quantity cannot be less than 1");
    } else {
      updateQuantity({ userId, itemId, quantity: quantity - 1 });
    }
  };

  const { mutate: updateQuantity, isPending } = useMutation({
    mutationFn: async ({ userId, itemId, quantity }) => {
      const response = await axios.patch("/auth/user/cart", {
        userId,
        itemId,
        quantity,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { userId } = variables;
      if (!data.success) {
        toast.error(data.message || "Something went wrong.");
      } else {
        queryClient.invalidateQueries(["cartData", userId]);
        toast.success("Cart updated successfully.");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  if (!cart?.items?.length) {
    return (
      <div className="w-full md:w-3/4 lg:w-2/3 h-[60vh] flex items-center justify-center text-lg text-gray-600 border rounded-2xl p-4">
        Your Cart is empty
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 h-[70vh] overflow-y-auto flex flex-col gap-6 rounded-2xl border p-4">
      {cart.items.map((item) => {
        const { _id, product, variant, price, discount, size, quantity } = item;
        const userChosenVariant = product.variants.find(
          (productVariant) => productVariant._id === variant
        ) || {};
        const finalPrice = price - (price * discount) / 100;

        return (
          <div
            key={_id}
            className="p-4 border-b border-gray-300 flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4"
          >
            {/* Image & Details */}
            <div className="flex gap-3 w-full sm:w-2/3">
              <Image
                src={userChosenVariant.images?.[0]?.url || "/placeholder.png"}
                width={124}
                height={124}
                alt="item image"
                className="max-w-[100px] sm:max-w-[124px] object-cover"
              />
              <Link href={`/topselling/${product._id}`}>
                <div className="flex flex-col gap-2">
                  <span className="text-base sm:text-lg lg:text-xl font-bold">
                    {product.title}
                  </span>
                  <div className="flex gap-2 text-sm sm:text-base">
                    <span className="text-black">Size:</span>
                    <span className="text-black/60">{size}</span>
                  </div>
                  <div className="flex gap-2 text-sm sm:text-base">
                    <span className="text-black">Color:</span>
                    <span className="text-black/60">{userChosenVariant.color}</span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-lg font-bold">
                      &#8377; {finalPrice}
                    </span>
                    <span className="text-lg font-semibold line-through text-gray-500">
                      &#8377; {price}
                    </span>
                    <span className="inline-flex items-center justify-center bg-red-200 text-red-500 text-xs sm:text-sm px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center sm:items-end gap-4 w-full sm:w-1/3">
              <Alert userId={cart.user} itemId={_id}>
                <AiFillDelete className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF3333] cursor-pointer hover:text-[#FF3333]/60" />
              </Alert>
              <div className="rounded-full flex px-3 sm:px-4 py-2 items-center bg-gray-200 justify-between border border-gray-300 gap-3 sm:gap-5">
                <FaMinus
                  className={`cursor-pointer ${
                    isPending ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => decrementQuantity(cart.user, _id, quantity)}
                />
                <span className="text-sm sm:text-base">{quantity}</span>
                <FaPlus
                  className={`cursor-pointer ${
                    isPending ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => incrementQuantity(cart.user, _id, quantity)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
