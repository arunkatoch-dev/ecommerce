import Checkout from "@/app/components/cartComponents/Checkout/Checkout";
import Footer from "@/app/components/Homepage/Footer";
import React from "react";

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
