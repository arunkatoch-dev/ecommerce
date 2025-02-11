"use client";
import React, { useState } from "react";
import UseProductsQuery from "@/app/hooks/useProductsQuery";
import dynamic from "next/dynamic";
import Loader from "../Loader/Loader";
const TopSellingAllProducts = dynamic(() => import("./AllProducts"), {
  loading: () => <Loader />,
});
const FilterProducts = dynamic(() => import("../Filters/FilterProducts"), {
  loading: () => <Loader />,
});

const ProductsDataFetchingWrapper = ({ useTo }) => {
  let defaultSortField = "createdAt";
  let defaultsortOrder = "desc";
  if (useTo === "fetch-new-arrivals") {
    defaultSortField = "createdAt";
    defaultsortOrder = "desc";
  } else if (useTo === "fetch-top-selling") {
    defaultSortField = "title";
    defaultsortOrder = "asc";
  }
  const [sortValues, setSortValues] = useState({
    page: 1,
    limit: 12,
    sortField: defaultSortField,
    sortOrder: defaultsortOrder,
    color: null,
    minPrice: null,
    maxPrice: null,
    size: null,
    category: null,
    subCategory: null,
  });
  const {
    data: topSellingData,
    isLoading: isTopSellingDataLoading,
    error: isTopSellingDataError,
  } = UseProductsQuery(sortValues);
  return (
    <section className="w-full min-h-screen py-10 px-4 flex flex-col lg:flex-row overflow-y-auto">
      <FilterProducts sortValues={sortValues} setSortValues={setSortValues} />
      <TopSellingAllProducts
        sortValues={sortValues}
        setSortValues={setSortValues}
        topSellingData={topSellingData}
        isTopSellingDataLoading={isTopSellingDataLoading}
        isTopSellingDataError={isTopSellingDataError}
      />
    </section>
  );
};

export default ProductsDataFetchingWrapper;
