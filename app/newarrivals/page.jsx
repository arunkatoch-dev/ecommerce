import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Homepage/Footer";
import ProductsDataFetchingWrapper from "../components/Products/ProductsDataFetchingWrapper";

const NewArrivals = () => {
  return (
    <>
      <Navbar />
      <ProductsDataFetchingWrapper useTo="fetch-new-arrivals" />
      <Footer />
    </>
  );
};

export default NewArrivals;
