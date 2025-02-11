"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserProfileData = async (userId) => {
  const response = await axios.get(`/auth/user/profile?userId=${userId}`);
  return response.data;
};

const UseUserProfileQuery = (userId) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfileData(userId),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
    retry: false,
  });
};

export default UseUserProfileQuery;
