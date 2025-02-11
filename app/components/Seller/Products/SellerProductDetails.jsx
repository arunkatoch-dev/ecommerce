"use client";
import React, { useState } from "react";
import StarRating from "../../StarRatings/StarRating";
import { IoIosCheckmark } from "react-icons/io";

const SellerProductDetails = ({
  activeColor,
  activeSize,
  handleColorChange,
  handleSizeChange,
  product,
}) => {
  const {
    title,
    shortDescription,
    price,
    discount,
    variants,
    seller,
    category,
    subCategory,
    rating,
  } = product;
  console.log("seller Product", product);
  const afterDiscountPrice = price - (price * discount) / 100;
  const [selectedSize, setSelectedSize] = useState(activeSize[0]);
  const [selectedColor, setSelectedColor] = useState(activeColor);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const handleColorClick = (color, sizes) => {
    handleColorChange(color);
    handleSizeChange(sizes);
    setSelectedColor(color);
    setSelectedSize(sizes[0]);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increment") return prev + 1;
      if (type === "decrement" && prev > 1) return prev - 1;
      return prev;
    });
  };

  return (
    <div className="w-1/2 flex flex-col px-3">
      <span className="text-4xl font-bold tracking-tighter uppercase">
        {title}
      </span>
      <div className="flex py-2">
        <StarRating rating={rating} />
      </div>
      <div className="flex gap-3 items-center py-2">
        <span className="text-3xl font-bold">&#8377; {afterDiscountPrice}</span>
        <span className="text-3xl font-semibold line-through text-gray-500">
          &#8377; {price}
        </span>
        <span className="inline-flex items-center justify-center bg-red-200 text-red-500 text-sm px-2 py-1 rounded-full">
          -{discount}%
        </span>
      </div>
      <div className="pb-4 border-b border-gray-300">
        <p className="text-gray-500">{shortDescription}</p>
      </div>
      <div className="flex flex-col gap-2 py-4 border-b border-gray-300">
        <span className="text-[#000000]/60 font-semibold">
          Available colors
        </span>
        <div className="flex gap-2">
          {variants?.map((variant) => {
            const { _id, color, sizes, stock, sku } = variant;
            return (
              <div
                className="flex items-center  flex-col gap-2 w-full"
                key={_id}
              >
                <button
                  className={`w-8 h-8 rounded-full border border-gray-300 flex items-center cursor-pointer justify-center`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedVariant(variant);
                    handleColorClick(color, sizes);
                  }}
                >
                  {color === activeColor && (
                    <IoIosCheckmark className={`text-white text-lg`} />
                  )}
                </button>
                <div className="flex flex-col gap-3 items-center justify-between">
                  <div className="flex">
                    <span className="font-bold">Stock:</span>
                    <span className="font-semibold">{stock}</span>
                  </div>

                  <span className="font-semibold">{sku}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4 border-b border-gray-300">
        <span className="text-[#000000]/60 font-semibold">
          Available Sizes{" "}
        </span>
        <div className="flex gap-2">
          {activeSize?.map((size) => (
            <button
              key={size}
              className={`px-6 py-2 ${
                size === selectedSize ? "bg-gray-400" : "bg-gray-300"
              } rounded-full border border-gray-300`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <span className="font-bold">Seller Id:</span>
          <span className="font-semibold">{seller}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Category:</span>
          <span className="font-semibold">{category}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Sub Category:</span>
          <span className="font-semibold">{subCategory}</span>
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetails;
