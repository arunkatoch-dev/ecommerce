"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import dynamic from "next/dynamic";
const Product = dynamic(() => import("../ProductDetails/Product"), {
  loading: () => <Loader />,
});
const Navbar = dynamic(() => import("../Navbar/Navbar"));

const fetchProduct = async (_id) => {
  const response = await axios.get(`/products/${_id}`);
  return response.data;
};


const SingleProduct = ({ _id }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => fetchProduct(_id),
  });
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <Error message={error.message} />;
  }
  return (
    <>
      <Navbar />
      {/* Product component is used by both user and seller useBy prop is passed to enable, disable some functionalities like hiding cart data, quantity select to seller,    */}
      <Product product={data.product} useBy="user" />
    </>
  );
};

export default SingleProduct;
