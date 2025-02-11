"use client";
import { MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import React, { useState } from "react";
import { useUserData } from "@/app/context/UserAuthProvider";
const visibleStyles =
  "w-full flex px-3 md:px-0 flex-col md:flex-row md:items-center md:justify-center gap-2 bg-black text-white py-2 relative";
const hiddenStyles = "hidden";

const SignupPopup = () => {
  const { data, isLoading, error } = useUserData();
  const [display, setDisplay] = useState(visibleStyles);
  const closePopup = () => {
    setDisplay(hiddenStyles);
  };
  if (isLoading) return null;
  return (
    <>
      {!data?.user?._id && (
        <div className={display}>
          <p>Sign up and get 20% off to your first order.</p>
          <Link href="signup" className="underline">
            <p>Sign Up Now</p>
          </Link>
          <MdOutlineClose
            className="text-lg absolute right-5 md:right-24 cursor-pointer"
            onClick={closePopup}
          />
        </div>
      )}
    </>
  );
};

export default SignupPopup;
