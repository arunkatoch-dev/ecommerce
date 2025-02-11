import Footer from "@/app/components/Homepage/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import Whishlist from "@/app/components/Whishlist/Wishlist";
import React from "react";

const WhishListPage = async ({ params }) => {
  const user = (await params).user;
  return (
    <>
      <Navbar />
      <Whishlist user={user} />
      <Footer />
    </>
  );
};

export default WhishListPage;
