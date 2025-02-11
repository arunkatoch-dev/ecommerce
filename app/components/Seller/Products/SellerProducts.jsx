"use client";
import Loader from "../../Loader/Loader";
import Error from "../../Error/Error";
import { FaPlus } from "react-icons/fa6";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import dynamic from "next/dynamic";
const SellerProduct = dynamic(() => import("./SellerProduct"), {
  loading: () => <Loader />,
});
const AddNewProduct = dynamic(() => import("./AddNewProduct"), {
  loading: () => <Loader />,
});
const FullProductView = dynamic(() => import("./FullProductView"), {
  loading: () => <Loader />,
});

const fetchSellerProducts = async (sellerId) => {
  const response = await axios.get(
    `/auth/seller/products/?sellerId=${sellerId}`
  );
  return response.data;
};

const SellerProducts = ({ sellerId }) => {
  if (!sellerId) {
    toast.error("Seller Id not found...");
    return null;
  }
  const [openFullView, setOpenFullView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const { data, isLoading, error } = useQuery({
    queryKey: ["sellerProducts", sellerId],
    queryFn: () => fetchSellerProducts(sellerId),
    enabled: !!sellerId,
  });

  const productFullViewHandler = (toggleVal = false) => {
    setOpenFullView(toggleVal);
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;
  const { products } = data;
  return (
    <>
      <section className="w-full flex flex-col p-5">
        <Sheet>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-bold text-2xl">Your Products:</span>
            <SheetTrigger className="flex items-center justify-center cursor-pointer gap-2 px-5 py-2 rounded-full bg-orange-600 hover:bg-orange-500 text-white">
              <FaPlus />
              Add New Product
            </SheetTrigger>
          </div>
          <SheetContent className="h-screen overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Product</SheetTitle>
              <SheetDescription>
                Fill in the details to add a new product.
              </SheetDescription>
            </SheetHeader>
            <AddNewProduct sellerId={sellerId} />
          </SheetContent>
        </Sheet>
        <div className="mt-5">
          {products &&
            products?.map((product) => (
              <SellerProduct
                key={product._id}
                sellerId={sellerId}
                product={product}
                productFullViewHandler={productFullViewHandler}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
        </div>
        {openFullView && (
          <FullProductView
            productFullViewHandler={productFullViewHandler}
            product={selectedProduct}
          />
        )}
      </section>
    </>
  );
};

export default SellerProducts;
