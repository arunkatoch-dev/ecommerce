"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProductReviews = async (productId) => {
  const response = await axios.get(`/products/ratings?productId=${productId}`);
  return response.data;
};

const useReviewsQuery = (productId) => {
  return useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => fetchProductReviews(productId),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
    retry: false,
  });
};

export default useReviewsQuery;
