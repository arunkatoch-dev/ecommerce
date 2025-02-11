import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Homepage/Footer";
import ProductsDataFetchingWrapper from "../components/Products/ProductsDataFetchingWrapper";

const TopSelling = () => {
  return (
    <>
      <Navbar />
      <ProductsDataFetchingWrapper useTo="fetch-top-selling" />
      <Footer />
    </>
  );
};

export default TopSelling;
