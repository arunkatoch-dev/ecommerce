"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "../Loader/Loader";
import useReviewsQuery from "@/app/hooks/useReviewsQuery";
const SellerProductDetails = dynamic(
  () => import("../Seller/Products/SellerProductDetails"),
  {
    loading: () => <Loader />,
  }
);
const ProductReviews = dynamic(() => import("./ProductReviews"), {
  loading: () => <Loader />,
});
const ProductDescription = dynamic(() => import("./ProductDescription"), {
  loading: () => <Loader />,
});
const ProductImages = dynamic(() => import("./ProductImages"), {
  loading: () => <Loader />,
});
const ProductDetails = dynamic(() => import("./ProductDetails"), {
  loading: () => <Loader />,
});

const Product = ({ product, useBy = "user" }) => {
  const { _id, variants, productDetails } = product;
  const {
    data: productReviews,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useReviewsQuery(_id);

  let defaultColor = variants[0].color;
  let defaultSelectedSize = variants[0].sizes;
  const [activeColor, setActiveColor] = useState(defaultColor);
  const [activeSize, setActiveSize] = useState(defaultSelectedSize);
  const productImages = variants.find(
    (variant) => variant.color === activeColor
  );

  const handleSizeChange = (size) => {
    setActiveSize(size);
  };
  const handleColorChange = (color) => {
    setActiveColor(color);
  };

  return (
    <section
      className={
        useBy === "user"
          ? "w-full py-2 px-2 md:px-24 flex flex-col"
          : "w-full py-2 px-2 flex flex-col"
      }
    >
      <div className="flex flex-col md:flex-row w-full justify-between py-5">
        <ProductImages productImages={productImages} />
        {useBy === "user" ? (
          <ProductDetails
            product={product}
            activeColor={activeColor}
            activeSize={activeSize}
            handleColorChange={handleColorChange}
            handleSizeChange={handleSizeChange}
          />
        ) : (
          <SellerProductDetails
            product={product}
            activeColor={activeColor}
            activeSize={activeSize}
            handleColorChange={handleColorChange}
            handleSizeChange={handleSizeChange}
          />
        )}
      </div>
      <ProductDescription productDetails={productDetails} />
      <ProductReviews
        averageRating={product?.rating}
        productReviews={productReviews}
        isReviewsLoading={isReviewsLoading}
        reviewsError={reviewsError}
      />
    </section>
  );
};

export default Product;
