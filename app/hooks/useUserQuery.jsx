"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchUserData = async () => {
  const response = await axios.get(`/auth/user`);
  return response.data;
};

const UseUserQuery = () => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount
    retry: false,
  });

};

export default UseUserQuery;
