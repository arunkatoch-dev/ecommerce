"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCategories = async () => {
  const response = await axios.get(`/category`);
  return response.data;
};

const UseCategoriesQuery = () => {
  return useQuery({
    queryKey: ["productCategories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
  });
};

export default UseCategoriesQuery;
