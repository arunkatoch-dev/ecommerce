"use client";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Link from "next/link";
import dynamic from "next/dynamic";
const StarRating = dynamic(() => import("../StarRatings/StarRating"), {
  loading: () => <Loader />,
});
const ProductsPagination = dynamic(
  () => import("../Pagination/ProductsPagination"),
  {
    loading: () => <Loader />,
  }
);
import Image from "next/image";
import Error from "../Error/Error";

const TopSellingAllProducts = ({
  sortValues,
  setSortValues,
  isTopSellingDataError,
  isTopSellingDataLoading,
  topSellingData,
}) => {
  const [selectedSortVal, setSelectedSortVal] = useState("sortAlphaAsc");

  const onSortChangeHandler = (e) => {
    const { value } = e.target;
    let sortField = "title";
    let sortOrder = "asc";

    if (value === "sortAlphaAsc") {
      sortField = "title";
      sortOrder = "asc";
    } else if (value === "sortAlphaDesc") {
      sortField = "title";
      sortOrder = "desc";
    } else if (value === "sortPriceAsc") {
      sortField = "price";
      sortOrder = "asc";
    } else if (value === "sortPriceDesc") {
      sortField = "price";
      sortOrder = "desc";
    }

    setSortValues((prevValues) => ({
      ...prevValues,
      sortField,
      sortOrder,
    }));

    setSelectedSortVal(value);
  };

  return (
    <>
      {isTopSellingDataLoading ? (
        <div className="w-full h-full flex items-center justify-center p-5">
          <Loader />
        </div>
      ) : isTopSellingDataError ? (
        <Error message={isTopSellingDataError.message} />
      ) : (
        <div className="flex flex-col justify-between">
          <div className="min-h-[60vh] max-w-full w-full flex flex-col p-1 md:p-5">
            <div className="w-full flex items-center justify-between gap-4">
              <span className="text-xl md:text-2xl font-bold">
                {sortValues.category ? sortValues.category : "Casual"}
              </span>
              <div className="flex flex-col md:flex-row gap-2 items-center">
                <span className="text-black/60 text-sm md:text-base">
                  Showing {topSellingData?.products?.length} of{" "}
                  {topSellingData?.pagination?.totalProducts} Products
                </span>
                <div className="flex gap-2 items-center">
                  <span className="text-black/60 text-sm md:text-base">
                    Sort By:
                  </span>
                  <select
                    name="sortBy"
                    id="sortBy"
                    className="font-semibold cursor-pointer outline-none text-sm md:text-base"
                    onChange={onSortChangeHandler}
                    value={selectedSortVal}
                  >
                    <option value="sortAlphaAsc">a-z</option>
                    <option value="sortAlphaDesc">z-a</option>
                    <option value="sortPriceAsc">low - high</option>
                    <option value="sortPriceDesc">high - low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
              {topSellingData?.products?.length > 0 ? (
                topSellingData?.products?.map((product) => {
                  const afterDiscountPrice =
                    product.price - (product.price * product.discount) / 100;
                  return (
                    <div
                      key={product._id}
                      className="flex flex-col items-center justify-center p-4 cursor-pointer w-full"
                    >
                      <Link href={`/topselling/${product._id}`}>
                        <div className="relative w-[295px] h-[298px] sm:w-[200px] md:w-[235px]">
                          <Image
                            src={product.variants[0]?.images[0]?.url}
                            alt={product.title}
                            fill
                            style={{
                              objectFit: "contain",
                              borderRadius: "5px",
                            }}
                            priority
                            sizes="235px"
                          />
                        </div>
                        <div className="w-full flex flex-col items-start gap-2 justify-start p-2">
                          <span className="text-base font-bold">
                            {product.title}
                          </span>
                          <StarRating rating={product.rating} />
                          <div className="flex gap-2 items-center py-1">
                            <span className="text-base font-bold">
                              &#8377; {afterDiscountPrice}
                            </span>
                            <span className="text-lg font-semibold line-through text-gray-500">
                              &#8377; {product.price}
                            </span>
                            <span className="inline-flex items-center justify-center bg-red-200 text-red-500 text-sm px-2 py-1 rounded-full">
                              -{product.discount}%
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <Error message="No Product Found." />
              )}
            </div>
          </div>
          <ProductsPagination
            pagination={topSellingData?.pagination}
            sortValues={sortValues}
            setSortValues={setSortValues}
          />
        </div>
      )}
    </>
  );
};

export default TopSellingAllProducts;
