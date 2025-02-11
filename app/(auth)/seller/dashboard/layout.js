import React from "react";
import SellerNav from "../../../components/Seller/SellerNav";
import AsideBar from "../../../components/Seller/AsideBar";
import SellerDataProvider from "@/app/components/Seller/SellerDataProvider";

const layout = ({ children }) => {
  return (
    <SellerDataProvider>
      <SellerNav />
      <section className="flex w-full h-[90vh] relative">
        <AsideBar />
        <div className="w-full  h-full">{children}</div>
      </section>
    </SellerDataProvider>
  );
};

export default layout;
