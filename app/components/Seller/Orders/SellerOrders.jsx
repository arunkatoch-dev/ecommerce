"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSellerData } from "../SellerDataProvider";
import UseSellerOrdersQuery from "@/app/hooks/useSellerOrdersQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Loader from "../../Loader/Loader";
import Error from "../../Error/Error";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerOrders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  // ✅ Fetch seller data
  const {
    data: sellerData,
    isLoading: sellerDataLoading,
    error: sellerError,
  } = useSellerData();
  const sellerId = sellerData?.seller?._id;
  const {
    data: sellerOrdersData,
    isLoading: sellerOrdersLoading,
    error: sellerOrdersError,
  } = UseSellerOrdersQuery(sellerId);

  if (sellerDataLoading) return <Loader />;
  if (sellerError) return <Error message={sellerError.message} />;
  if (!sellerId) return <Error message="Seller ID is missing!" />;

  // ✅ Order Status Change
  const handleOrderStatusChange = async (orderId, itemId, status) => {
    try {
      const response = await axios.patch(`/auth/seller/orders`, {
        orderId,
        itemId,
        status,
      });
      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
      }
      queryClient.invalidateQueries(["sellerOrders", sellerId]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="p-4">
      {sellerOrdersLoading ? (
        <Loader />
      ) : sellerOrdersError ? (
        <Error message={sellerOrdersError.message} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Customer</TableHead> */}
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Size & Color</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerOrdersData?.orders.map((order, orderIndex) =>
                order?.items?.map((item, itemIndex) => {
                  if (!item.product) {
                    return null;
                  }
                  // ✅ Find the correct variant from product variants
                  const productVariants = item?.product?.variants || [];
                  const variantDetails =
                    productVariants.find(
                      (variant) => variant._id === item.variant
                    ) || {};

                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Image
                          src={variantDetails?.images[0]?.url}
                          alt={item.product.title}
                          width={64}
                          height={64}
                          className=" rounded-md"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{item.product.title}</p>
                      </TableCell>
                      {/* ✅ Show Size & Color from Variant */}
                      <TableCell>
                        <p>Size: {item.size}</p>
                        <p>Color: {variantDetails.color || "N/A"}</p>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      {/* ✅ Stock Details */}
                      <TableCell>
                        <p>{variantDetails.stock}</p>
                      </TableCell>

                      <TableCell>
                        <Select
                          onValueChange={(value) => {
                            handleOrderStatusChange(order._id, item._id, value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={item.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ✅ Order Details Dialog */}
          <Dialog
            open={!!selectedOrder}
            onOpenChange={() => setSelectedOrder(null)}
          >
            <DialogContent>
              <DialogTitle className="text-xl font-semibold mb-2">
                Order Details
              </DialogTitle>
              <Card>
                <CardContent>
                  {selectedOrder && (
                    <div className="flex flex-col gap-3">
                      <p>
                        <strong>Order Id:</strong>#{selectedOrder._id}
                      </p>
                      <p className="inline-flex gap-2">
                        <strong> Name:</strong>
                        <span>{selectedOrder.shippingAddress.name}</span>
                        <strong> Phone:</strong>
                        <span>{selectedOrder.shippingAddress.phone}</span>
                      </p>
                      <p>
                        <strong>Email:</strong>
                        <span className="pl-2">
                          {selectedOrder.shippingAddress.email}
                        </span>
                      </p>
                      <p>
                        <strong>Shipping Address:</strong>{" "}
                        {selectedOrder.shippingAddress.street},{" "}
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                      <p>
                        <strong>Postal Code:</strong>{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  )}
                  {/* <Button
                    className="mt-2"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button> */}
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        </>
      )}
      <ToastContainer position="top-center" autoClose={1500} />
    </section>
  );
};

export default SellerOrders;
