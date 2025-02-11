"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSellerData = async () => {
  const response = await axios.get(`/auth/seller`);
  return response.data;
};

const UseSellerQuery = () => {
  return useQuery({
    queryKey: ["sellerData"],
    queryFn: fetchSellerData,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
  });
};

export default UseSellerQuery;
