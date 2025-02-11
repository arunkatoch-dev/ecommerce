import React from "react";
import { MdClose } from "react-icons/md";
import Loader from "../../Loader/Loader";
import dynamic from "next/dynamic";

const Product = dynamic(() => import("../../ProductDetails/Product"), {
  loading: () => <Loader />,
});

const FullProductView = ({ productFullViewHandler, product }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-stone-600 fixed bg-blur-2xl p-4 top-0 left-0 overflow-y-auto ">
      <div className="bg-white rounded-2xl w-[85%] h-screen p-4 overflow-y-auto flex flex-col">
        <div className="flex items-end justify-end w-full">
          <MdClose
            className="text-3xl cursor-pointer hover:text-black/80"
            onClick={(e) => {
              e.preventDefault();
              productFullViewHandler(false);
            }}
          />
        </div>
        <Product product={product} useBy="seller" />
      </div>
    </div>
  );
};

export default FullProductView;
