"use client";
import { FaHeart } from "react-icons/fa";
import { useUserData } from "@/app/context/UserAuthProvider";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoIosCheckmark } from "react-icons/io";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import UseWhishlistQuery from "@/app/hooks/useWhishlistQuery";


const StarRating = dynamic(
  () => import("@/app/components/StarRatings/StarRating"),
  {
    loading: () => <Loader />,
  }
);

const ProductDetails = ({
  activeColor,
  activeSize,
  handleColorChange,
  handleSizeChange,
  product,
}) => {
  const { data, isLoading } = useUserData();
  const { title, shortDescription, price, discount, variants, seller, rating } =
    product;
  const queryClient = useQueryClient();
  const afterDiscountPrice = price - (price * discount) / 100;
  const [selectedSize, setSelectedSize] = useState(activeSize[0]);
  const [selectedColor, setSelectedColor] = useState(activeColor);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [wishListFound, setWishListFound] = useState(false);

  const handleColorClick = (color, sizes) => {
    handleColorChange(color);
    handleSizeChange(sizes);
    setSelectedColor(color);
    setSelectedSize(sizes[0]);
  };

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const { userId, productId, variantId, quantity, size } = formData;
      const response = await axios.post("/auth/user/cart", {
        userId,
        productId,
        variantId,
        quantity,
        size,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success(data.message || "Added to cart");
        queryClient.invalidateQueries(["cartData"]);
      }
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  const { mutate: mutateAddWhishlist, isPending: isAddingWhishListLoading } =
    useMutation({
      mutationFn: async ({ userId, productId }) => {
        const response = await axios.post("/whishlist", {
          userId,
          productId,
        });
        return response.data;
      },
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message || "Something went wrong");
        } else {
          toast.success(data.message || "Wishlist Updated");
          queryClient.invalidateQueries(["userWhishlist", data.userId]);
        }
      },
      onError: (error) => {
        console.error("Wishlist error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
      },
    });

  const handleAddToCart = () => {
    if (!data?.user) {
      toast.error("Please login to add to cart");
      return;
    }

    if (!selectedVariant || !selectedSize || quantity < 1) {
      toast.error("Please select all required options");
      return;
    }

    mutate({
      userId: data.user._id,
      productId: product._id,
      variantId: selectedVariant._id,
      quantity,
      size: selectedSize,
    });
  };

  const addToWhishList = () => {
    if (!data?.user) {
      return toast.error("Please login to add items to the wishlist");
    }

    if (wishListFound) {
      return toast.error("Item already found in wishlist");
    }

    mutateAddWhishlist({ userId: data.user._id, productId: product._id });
  };

  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    isError: isWishlistError,
  } = UseWhishlistQuery(data?.user?._id);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increment") return prev + 1;
      if (type === "decrement" && prev > 1) return prev - 1;
      return prev;
    });
  };

  useEffect(() => {
    if (wishlistData?.wishlist?.products?.length > 0) {
      const findProduct = wishlistData.wishlist.products.find(
        ({ product: wishlistProduct }) => wishlistProduct._id === product._id
      );
      if (findProduct) {
        setWishListFound(true);
      }
    }
  }, [wishlistData, product._id]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full md:w-1/2 flex flex-col px-3">
      {/* Product Title */}
      <span className="text-2xl md:text-4xl font-bold tracking-tighter uppercase">
        {title}
      </span>

      <div className="flex py-2">
        <StarRating rating={rating} />
      </div>

      {/* Pricing */}
      <div className="flex flex-wrap gap-3 items-center py-2">
        <span className="text-2xl md:text-3xl font-bold">
          ₹ {afterDiscountPrice}
        </span>
        <span className="text-xl md:text-3xl font-semibold line-through text-gray-500">
          ₹ {price}
        </span>
        <span className="inline-flex items-center justify-center bg-red-200 text-red-500 text-sm px-2 py-1 rounded-full">
          -{discount}%
        </span>
      </div>

      {/* Short Description */}
      <div className="pb-4 border-b border-gray-300">
        <p className="text-gray-500 text-sm md:text-base">{shortDescription}</p>
      </div>

      {/* Color Selection */}
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-2 py-4 border-b border-gray-300">
          <span className="text-gray-600 font-semibold">Select colors</span>
          <div className="flex gap-2 flex-wrap">
            {variants?.map((variant) => {
              const { _id, color, sizes } = variant;
              return (
                <button
                  key={_id}
                  className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedVariant(variant);
                    handleColorClick(color, sizes);
                  }}
                >
                  {color === activeColor && (
                    <IoIosCheckmark className="text-white text-lg" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to wishlist Selection */}
        {!wishlistLoading && (
          <div className="flex items-center justify-center p-2">
            <FaHeart
              className={
                isAddingWhishListLoading
                  ? "cursor-not-allowed text-2xl text-gray-300"
                  : wishListFound
                  ? "text-2xl text-red-600 cursor-pointer"
                  : "text-2xl text-gray-400 cursor-pointer hover:text-gray-500"
              }
              onClick={!isAddingWhishListLoading ? addToWhishList : null}
            />
          </div>
        )}
      </div>

      {/* Size Selection */}
      <div className="flex flex-col gap-2 py-4 border-b border-gray-300">
        <span className="text-gray-600 font-semibold">Choose Size</span>
        <div className="flex gap-2 flex-wrap">
          {activeSize?.map((size) => (
            <button
              key={size}
              className={`px-4 py-2 text-sm md:text-base ${
                size === selectedSize ? "bg-gray-400" : "bg-gray-300"
              } rounded-full border border-gray-300`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-3 py-3 justify-between items-center">
        {/* Quantity Selector */}
        <div className="rounded-full flex px-4 py-2 items-center justify-between border border-gray-300 w-full sm:w-[40%]">
          <FaMinus
            className={`cursor-pointer ${
              quantity === 1 ? "text-gray-300" : ""
            }`}
            onClick={() => handleQuantityChange("decrement")}
          />
          <span className="text-lg">{quantity}</span>
          <FaPlus
            className="cursor-pointer"
            onClick={() => handleQuantityChange("increment")}
          />
        </div>

        {/* Add to Cart Button */}
        <button
          className={`bg-black hover:bg-black/80 text-white w-full sm:w-[60%] p-3 rounded-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAddToCart}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding to Cart..." : "Add To Cart"}
        </button>
      </div>

      {/* Seller Info */}
      <div className="flex gap-2 py-4">
        <span className="text-lg md:text-xl font-bold">Sold By:</span>
        <span className="text-base md:text-lg font-semibold">
          {seller?.name}
        </span>
      </div>
    </div>
  );
};

export default ProductDetails;
