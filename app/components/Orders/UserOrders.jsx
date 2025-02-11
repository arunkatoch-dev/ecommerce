"use client";
import UseUserOrdersQuery from "@/app/hooks/useUserOrdersQuery";
import React from "react";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const UserProductReview = dynamic(() => import("./UserProductReview"), {
  loading: () => <Loader />,
});

const UserOrders = ({ userId }) => {
  if (!userId) {
    return <Error message="User Id is required." />;
  }
  const {
    data: userOrdersData,
    isLoading: userOrdersLoading,
    error: userOrdersError,
  } = UseUserOrdersQuery(userId);

  return (
    <section className="w-full min-h-screen flex flex-col">
      {userOrdersLoading ? (
        <div className="w-full h-[80vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : userOrdersError ? (
        <Error message={userOrdersError.message} />
      ) : (
        <>
          {userOrdersData.orders &&
            userOrdersData?.orders?.map((order) => {
              const { _id, totalPrice, shippingAddress, paymentMethod, items } =
                order;

              return (
                <div className="w-full bg-white px-4  lg:px-24 py-5" key={_id}>
                  <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                  <p className="text-gray-600 mb-2">Order ID: {_id}</p>
                  <p className="text-gray-600 mb-2">
                    Payment Method: {paymentMethod}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Order Date:
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <h3 className="text-2xl font-bold mt-4">Items</h3>
                  {items.map((item) => {
                    const {
                      product,
                      variant,
                      size,
                      quantity,
                      price,
                      status,
                      discount,
                      _id,
                    } = item;
                    const userChoosenVariant =
                      product?.variants?.find(
                        (productVariant) => productVariant._id === variant
                      ) || {};
                    const finalPrice = price - (price * discount) / 100;
                    return (
                      <div
                        key={_id}
                        className="py-4 border-b border-gray-300 flex flex-col justify-between w-full"
                      >
                        <Link href={`/topselling/${product._id}`}>
                          <div className="flex gap-3">
                            <Image
                              src={userChoosenVariant.images?.[0]?.url}
                              width={124}
                              height={124}
                              alt="item image"
                            />
                            <div className="flex flex-col gap-2">
                              <span className="text-xl font-bold">
                                {product.title}
                              </span>
                              <div className="flex gap-2">
                                <span className="text-sm text-[#000000]">
                                  Size:
                                </span>
                                <span className="text-sm text-[#000000]/60">
                                  {size}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-sm text-[#000000]">
                                  Color:
                                </span>
                                <span className="text-sm text-[#000000]/60">
                                  {userChoosenVariant.color}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-sm text-[#000000]">
                                  Quantity:
                                </span>
                                <span className="text-sm text-[#000000]/60">
                                  {quantity}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-sm text-[#000000]">
                                  Status:
                                </span>
                                <span className="text-sm text-[#000000]/60">
                                  {status}
                                </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="text-lg font-bold">
                                  &#8377; {finalPrice}
                                </span>
                                <span className="text-lg font-semibold line-through text-gray-500">
                                  &#8377; {price}
                                </span>
                                <span className="inline-flex items-center justify-center bg-red-200 text-red-500 text-sm px-2 py-1 rounded-full">
                                  -{discount}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        {status === "delivered" && (
                          <UserProductReview
                            productId={product._id}
                            userId={userId}
                          />
                        )}
                      </div>
                    );
                  })}
                  <h3 className="text-xl font-semibold mt-4">
                    Total Price: ₹{totalPrice}
                  </h3>
                  <div className="flex flex-col border my-5 p-5 rounded-2xl">
                    <h3 className="text-xl font-semibold">Shipping Address</h3>
                    <p>{shippingAddress.name}</p>
                    <p>{shippingAddress.email}</p>
                    <p>{shippingAddress.phone}</p>
                    <p>
                      {shippingAddress.street}, {shippingAddress.city}
                    </p>
                    <p>
                      {shippingAddress.state}, {shippingAddress.country} -
                      {shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              );
            })}
        </>
      )}
      {userOrdersData?.orders?.length < 1 && (
        <Error message="No order history found." />
      )}
    </section>
  );
};

export default UserOrders;
