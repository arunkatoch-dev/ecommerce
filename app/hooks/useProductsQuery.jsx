"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await axios.get("/products", {
    params,
  });
  return response.data;
};

const UseProductsQuery = (params) => {
  return useQuery({
    queryKey: ["userProducts", params],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export default UseProductsQuery;
