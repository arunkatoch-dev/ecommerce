"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserOrders = async (userId) => {
  const response = await axios.get(`/auth/user/orders?userId=${userId}`);
  return response.data;
};

const UseUserOrdersQuery = (userId) => {
  return useQuery({
    queryKey: ["userOrders", userId],
    queryFn: () => fetchUserOrders(userId),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
    retry: false,
  });
};

export default UseUserOrdersQuery;
