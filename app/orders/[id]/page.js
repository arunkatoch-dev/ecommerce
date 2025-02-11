import React from "react";
import Footer from "@/app/components/Homepage/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import UserOrders from "@/app/components/Orders/UserOrders";

const ordersPage = async ({ params }) => {
  const userId = (await params).id;
  return (
    <>
      <Navbar />
      <UserOrders userId={userId} />
      <Footer />
    </>
  );
};

export default ordersPage;
