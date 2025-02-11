"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addressSchema } from "@/validationSchemas/validation";

const AddNewAddress = ({ setNewAddressWindow, userId }) => {
  if (!userId) {
    return <Error message="User ID is missing!" />;
  }

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/auth/user/profile", formData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "something went wrong");
        reset();
      } else {
        reset();
        toast.success(data.message || "Address added successfully");
        queryClient.invalidateQueries(["userProfile"]);
        setNewAddressWindow(false);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      reset();
    },
  });

  const onSubmit = (data) => {
    mutate({ ...data, userId });
  };

  return (
    <div className="w-full flex items-center justify-center py-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="gap-4 w-full flex flex-col"
        autoComplete="off"
      >
        <div className="w-full flex gap-2 p-4">
          <Card className="w-full py-3">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Add your details below:
              </h2>
              <div className="grid gap-2">
                <div>
                  <Input
                    type="text"
                    {...register("name")}
                    placeholder="Full Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="Email Address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="phone"
                    {...register("phone")}
                    placeholder="Phone Number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    {...register("street")}
                    placeholder="Street Address"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm">
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input type="text" {...register("city")} placeholder="City" />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    {...register("state")}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    {...register("country")}
                    placeholder="Country"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    {...register("postalCode")}
                    placeholder="Postal Code"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className={
            isPending
              ? "cursor-not-allowed w-full bg-green-400"
              : "w-full bg-green-500 hover:bg-green-600"
          }
        >
          {isPending ? "Saving..." : "Save Address"}
        </Button>
      </form>
    </div>
  );
};

export default AddNewAddress;
