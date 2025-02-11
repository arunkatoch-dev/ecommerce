"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserWhishlist = async (userId) => {
  const response = await axios.get(`/whishlist?userId=${userId}`);
  return response.data;
};

const UseWhishlistQuery = (userId) => {
  return useQuery({
    queryKey: ["userWhishlist", userId],
    queryFn: () => fetchUserWhishlist(userId),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
    retry: false,
  });
};

export default UseWhishlistQuery;
