"use client";
import React from "react";
import Loader from "../Loader/Loader";
import UseCartQuery from "@/app/hooks/useCartQuery";
import dynamic from "next/dynamic";

const OrderSummary = dynamic(() => import("./OrderSummary"), {
  loading: () => <Loader />,
});
const CartItems = dynamic(() => import("./CartItems"), {
  loading: () => <Loader />,
});
const Navbar = dynamic(() => import("../Navbar/Navbar"));

const Cart = () => {
  const { userLoading, userError, cartLoading, cartError, cartData } =
    UseCartQuery();

  if (userLoading || cartLoading) return <Loader />;

  // Check for errors
  if (userError || cartError) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center px-4 sm:px-8 lg:px-24 py-5">
          <p className="text-red-500 text-center">
            {userError?.message || cartError?.message || "Something went wrong"}
          </p>
        </section>
      </>
    );
  }
  console.log(cartData);
  return (
    <>
      <Navbar />
      <section className="flex flex-col lg:flex-row items-center lg:items-start px-4 sm:px-8 lg:px-24 gap-4 sm:gap-6 lg:gap-10 py-5">
        <CartItems cart={cartData?.cart} />
        <OrderSummary cart={cartData?.cart} />
      </section>
    </>
  );
};

export default Cart;
