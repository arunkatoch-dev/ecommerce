import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";
import React from "react";

const Checkout = dynamic(
  () => import("@/app/components/cartComponents/Checkout/Checkout"),
  {
    loading: () => <Loader />,
  }
);
const Footer = dynamic(() => import("@/app/components/Homepage/Footer"), {
  loading: () => <Loader />,
});

const checkoutpage = async ({ params }) => {
  const _id = (await params).id;
  return (
    <>
      <Checkout userId={_id} />
      <Footer />
    </>
  );
};

export default checkoutpage;
