import React from "react";
import { BiLoader } from "react-icons/bi";
const Loader = () => {
  return (
    <div className="w-full py-4 flex items-center justify-center">
      <BiLoader className="text-2xl text-gray-600 animate-spin" />
    </div>
  );
};

export default Loader;
