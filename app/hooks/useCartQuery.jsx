"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserData } from "../context/UserAuthProvider";

const fetchCartData = async (userId) => {
  if (!userId) return null; // Ensure query doesn't run without a valid userId

  try {
    const response = await axios.get(`/auth/user/cart/?userId=${userId}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null; // Return null instead of throwing an error
    }
    throw new Error(err.response?.data?.message || "Failed to fetch cart data");
  }
};

const UseCartQuery = () => {
  const {
    isLoading: userLoading,
    error: userError,
    data: userData,
  } = useUserData();

  const userId = userData?.user?._id;

  const cartQuery = useQuery({
    queryKey: ["cartData", userId],
    queryFn: () => fetchCartData(userId),
    enabled: !!userId, // Run query only if userId exists
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on mount
    retry: false, // Disable automatic retries
  });

  return {
    userLoading,
    userError,
    userData,
    cartLoading: cartQuery.isLoading,
    cartError: cartQuery.error,
    cartData: cartQuery.data,
  };
};

export default UseCartQuery;
