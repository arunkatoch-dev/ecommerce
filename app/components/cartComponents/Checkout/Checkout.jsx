"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Error from "../../Error/Error";
import UseUserProfileQuery from "@/app/hooks/useUserProfileQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressSchema } from "@/validationSchemas/validation";
import Loader from "../../Loader/Loader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Script from "next/script";

const Checkout = ({ userId }) => {
  if (!userId) {
    return <Error message="User ID is missing!" />;
  }
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: userProfileData,
    isLoading: userProfileLoading,
    error: userProfileError,
  } = UseUserProfileQuery(userId);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("cash_on_delivery");

  const handlePaymentMethodChange = (value) => {
    setSelectedPaymentMethod(value);
  };

  const handleAddressSelect = (address) => {
    setValue("name", address.name);
    setValue("email", address.email);
    setValue("phone", address.phone);
    setValue("street", address.street);
    setValue("state", address.state);
    setValue("country", address.country);
    setValue("city", address.city);
    setValue("postalCode", address.postalCode);
    setSelectedAddress(address);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
  });

  const { mutate: saveAddress, isPending: isAddressPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/auth/user/profile", formData);
      return response.data;
    },
    onMutate: () => {
      // Show loading toast when mutation starts
      return toast.loading("Address adding...");
    },
    onSuccess: (data, variables, context) => {
      if (!data.success) {
        toast.dismiss(context); // Dismiss the loading toast
        toast.error(data.message || "something went wrong");
        reset();
      } else {
        toast.dismiss(context); // Dismiss the loading toast
        toast.success(data.message || "Address added successfully");
        queryClient.invalidateQueries(["userProfile", userId]);
        handleAddressSelect(data.address);
      }
    },
    onError: (error, variables, context) => {
      toast.dismiss(context); // Dismiss the loading toast
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      reset();
    },
  });

  const addNewAddressClick = () => {
    setValue("name", "");
    setValue("email", "");
    setValue("phone", "");
    setValue("street", "");
    setValue("state", "");
    setValue("country", "");
    setValue("city", "");
    setValue("postalCode", "");
    setSelectedAddress(null);
  };

  const onSaveAddress = (data) => {
    saveAddress({ ...data, userId });
  };

  const { mutate: orderMutate, isPending: isOrderPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/auth/user/orders", data);
      return response.data;
    },
    onMutate: () => {
      // Show loading toast when mutation starts
      return toast.loading("Processing your order...");
    },
    onSuccess: (data, variables, context) => {
      if (data.success === false) {
        toast.dismiss(context); // Dismiss the loading toast
        toast.error(data.message || "something went wrong");
        setSelectedAddress(null);
      } else {
        toast.success(data.message || "Order successfull");
        setSelectedAddress(null);
        queryClient.invalidateQueries(["userOrders", userId]);
        queryClient.invalidateQueries(["cartData", userId]);
        router.push(`/orders/${data.order.userId}`);
      }
    },
    onError: (error, variables, context) => {
      toast.dismiss(context); // Dismiss the loading toast
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setSelectedAddress(null);
    },
  });
  const { mutate: onlinePaymentMutate, isPending: isonlinePaymentPending } =
    useMutation({
      mutationFn: async (data) => {
        const response = await axios.post(
          "/auth/user/orders/verify-order",
          data
        );
        return response.data;
      },
      onMutate: () => {
        // Show loading toast when mutation starts
        return toast.loading("Processing your order...");
      },
      onSuccess: (data, variables, context) => {
        if (data.success === false) {
          toast.dismiss(context); // Dismiss the loading toast
          toast.error(data.message || "something went wrong");
          setSelectedAddress(null);
        } else {
          toast.success(data.message || "Order successfull");
          setSelectedAddress(null);
          queryClient.invalidateQueries([
            "userOrders",
            data.order.userId,
          ]);
          router.push(`/orders/${data.order.userId}`);
        }
      },
      onError: (error, variables, context) => {
        toast.dismiss(context); // Dismiss the loading toast
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
        setSelectedAddress(null);
      },
    });

  const handleRazorpayPayment = async () => {
    const { data } = await axios.post("/auth/user/orders/create-order", {
      userId,
    });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      handler: function (response) {
        onOrderClick({
          userId,
          shippingAddressId: selectedAddress._id,
          paymentMethod: "verify-razorpay",
          orderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      prefill: {
        name: selectedAddress.name,
        email: selectedAddress.email,
        contact: selectedAddress.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onOrderClick = ({
    userId,
    shippingAddressId,
    paymentMethod,
    orderId,
    razorpayPaymentId,
    razorpaySignature,
  }) => {
    if (paymentMethod === "online") {
      handleRazorpayPayment();
    } else if (paymentMethod === "verify-razorpay") {
      onlinePaymentMutate({
        userId,
        shippingAddressId,
        orderId,
        razorpayPaymentId,
        razorpaySignature,
      });
    } else {
      orderMutate({ userId, shippingAddressId, paymentMethod });
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col px-4 sm:px-8 relative">
      <h1 className="text-2xl font-bold py-5 text-center sm:text-left">
        Checkout
      </h1>
      <div className="w-full flex justify-center">
        <form
          className="gap-6 w-full sm:w-[80%] lg:w-[60%] flex flex-col"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="w-full flex flex-col sm:flex-row gap-4">
            {/* Address Form */}
            <Card className="w-full sm:w-1/2">
              <CardContent>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  Add your details:
                </h2>
                <div className="grid gap-3">
                  {[
                    "name",
                    "email",
                    "phone",
                    "street",
                    "city",
                    "state",
                    "country",
                    "postalCode",
                  ].map((field) => (
                    <div key={field}>
                      <Input
                        type="text"
                        {...register(field)}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                      />
                      {errors[field] && (
                        <p className="text-red-500 text-sm">
                          {errors[field].message}
                        </p>
                      )}
                    </div>
                  ))}
                  {!selectedAddress && (
                    <Button
                      onClick={handleSubmit((data) => onSaveAddress(data))}
                      disabled={isAddressPending}
                      className={`w-full ${
                        isAddressPending
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isAddressPending ? "Saving..." : "Save and Use"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card className="w-full sm:w-1/2">
              <CardContent>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  Select from Saved Addresses:
                </h2>
                {userProfileLoading ? (
                  <Loader />
                ) : userProfileError ? (
                  <Error message={userProfileError.message} />
                ) : userProfileData?.addresses?.length === 0 ? (
                  <div className="py-10 text-center text-red-800">
                    No Address Found
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {userProfileData.addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelect(address)}
                        className="w-full border bg-white text-black hover:bg-gray-200 text-left"
                      >
                        {address.name}, {address.street}, {address.city} (
                        {address.postalCode})
                      </div>
                    ))}
                  </div>
                )}
                {selectedAddress && (
                  <Button
                    onClick={addNewAddressClick}
                    className="w-full bg-blue-500 hover:bg-blue-600 mt-5"
                  >
                    Add New Address +
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Method */}
          <Card className="w-full p-4">
            <p className="text-xl font-bold">Select Payment Method:</p>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value) => {
                  handlePaymentMethodChange(value);
                }}
                className="flex flex-col gap-5 py-5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="cash_on_delivery"
                    id="cash_on_delivery"
                  />
                  <Label htmlFor="cash_on_delivery">Cash On Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="payOnline" />
                  <Label htmlFor="payOnline">Pay Online</Label>
                </div>
              </RadioGroup>
              <Button
                disabled={
                  !selectedAddress || isOrderPending || isonlinePaymentPending
                }
                onClick={() => {
                  onOrderClick({
                    userId,
                    shippingAddressId: selectedAddress._id,
                    paymentMethod: selectedPaymentMethod,
                  });
                }}
                className={`w-full py-2 text-white ${
                  !selectedAddress || isOrderPending || isonlinePaymentPending
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                {isOrderPending ? "Order in process..." : "Confirm Order"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {isonlinePaymentPending && (
        <div className="w-full h-screen bg-black/50 blur-lg fixed top-0 left-0 z-20 " />
      )}
    </section>
  );
};

export default Checkout;
