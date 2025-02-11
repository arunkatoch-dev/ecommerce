"use client";
import Link from "next/link";
import React from "react";
import { useSellerData } from "./SellerDataProvider";
import { IoIosMenu } from "react-icons/io";

const SellerNav = () => {
  const { data, isLoading, error, toggleSideBar, setToggleSideBar } =
    useSellerData();

  return (
    <nav className="w-full flex px-2 md:px-5 py-2 border-b justify-between bg-purple-600 text-white">
      <div className="flex gap-3 items-center justify-center">
        <button
          className="flex items-center justify-center"
          onClick={() => setToggleSideBar(!toggleSideBar)}
        >
          <IoIosMenu className="text-2xl cursor-pointer" />
        </button>
        <Link href="/seller/dashboard" className="font-bold md:text-2xl">
          SHOP.CO
        </Link>
      </div>
      <div className="hidden md:flex items-center justify-center gap-3">
        {isLoading ? null : error ? (
          <span className="font-bold ">{error.message || "error found"}</span>
        ) : (
          <>
            <span className="font-bold uppercase">Seller Id : </span>
            <span className="font-bold ">{data?.seller._id}</span>
          </>
        )}
      </div>
    </nav>
  );
};

export default SellerNav;
