"use client";
import React, { createContext, use, useState } from "react";
import UseSellerQuery from "@/app/hooks/useSellerQuery";

export const SellerDataContext = createContext(null);

export const useSellerData = () => use(SellerDataContext);

const SellerDataProvider = ({ children }) => {
  const { data, isLoading, error } = UseSellerQuery();
  const [toggleSideBar, setToggleSideBar] = useState(false); // I don't want to make a layout a client component so for now I put this state here
  return (
    <SellerDataContext.Provider
      value={{ data, isLoading, error, toggleSideBar, setToggleSideBar }}
    >
      {children}
    </SellerDataContext.Provider>
  );
};

export default SellerDataProvider;
