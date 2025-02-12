import React from "react";
import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const UserOrders = dynamic(() => import("@/app/components/Orders/UserOrders"), {
  loading: () => <Loader />,
});
const Navbar = dynamic(() => import("@/app/components/Navbar/Navbar"), {
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("@/app/components/Homepage/Footer"), {
  loading: () => <Loader />,
});

const OrdersPage = async ({ params }) => {
  const userId = (await params).id;
  return (
    <>
      <Navbar />
      <UserOrders userId={userId} />
      <Footer />
    </>
  );
};

export default OrdersPage;
