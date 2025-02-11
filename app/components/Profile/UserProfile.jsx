"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
const AddNewAddress = dynamic(() => import("./AddNewAddress"), {
  loading: () => <Loader />,
});
const Card = dynamic(
  () => import("@/components/ui/card").then((mod) => mod.Card),
  {
    loading: () => <Loader />,
  }
);
const CardContent = dynamic(
  () => import("@/components/ui/card").then((mod) => mod.CardContent),
  {
    loading: () => <Loader />,
  }
);
import UseUserProfileQuery from "@/app/hooks/useUserProfileQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const UserProfile = ({ _id }) => {
  if (!_id) {
    return <Error message="User ID is missing!" />;
  }
  const queryClient = useQueryClient();
  const {
    data: userProfileData,
    isLoading: userProfileLoading,
    error: userProfileError,
  } = UseUserProfileQuery(_id);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddressWindow, setNewAddressWindow] = useState(false);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (addressId) => {
      const response = await axios.delete(
        `/auth/user/profile?addressId=${addressId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success(data.message || "Address deleted successfully");
        queryClient.invalidateQueries(["userProfile"]);
        setSelectedAddress(null);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  const handleDeleteAddress = () => {
    if (selectedAddress) {
      mutate(selectedAddress._id);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 min-h-[80vh] px-4 sm:px-8 md:px-12 lg:px-24">
      <h2 className="py-4 font-bold text-2xl md:text-3xl">Profile</h2>

      {!newAddressWindow && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="w-full py-3">
            <CardContent>
              <div className="w-full mb-4">
                <h2 className="text-lg md:text-xl text-center font-semibold mb-2">
                  Your Saved Addresses:
                </h2>
                {userProfileLoading ? (
                  <Loader />
                ) : userProfileError ? (
                  <Error message={userProfileError.message} />
                ) : userProfileData?.addresses?.length === 0 ? (
                  <Error message="No address found" />
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    {userProfileData?.addresses?.map((address) => (
                      <Button
                        key={address._id}
                        onClick={() => handleAddressSelect(address)}
                        className="w-full border bg-white text-black hover:bg-gray-200 text-left text-sm sm:text-base"
                      >
                        {address.name}, {address.street}, {address.city} (
                        {address.postalCode})
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedAddress && (
            <Card className="w-full py-3">
              <CardContent>
                <h2 className="text-lg md:text-xl text-center font-semibold mb-2">
                  Full Address Details:
                </h2>
                <p>
                  <strong>Name:</strong> {selectedAddress.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedAddress.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedAddress.phone}
                </p>
                <p>
                  <strong>Address:</strong> {selectedAddress.street}
                </p>
                <p>
                  <strong>City:</strong> {selectedAddress.city}
                </p>
                <p>
                  <strong>State:</strong> {selectedAddress.state}
                </p>
                <p>
                  <strong>Postal Code:</strong> {selectedAddress.postalCode}
                </p>
                <p>
                  <strong>Country:</strong> {selectedAddress.country}
                </p>
                <div className="flex py-4 items-center justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger
                      className={`px-4 py-2 rounded-lg ${
                        isPending
                          ? "bg-red-300 text-white cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your address data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAddress}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Button
        className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-500 text-white my-4"
        onClick={() => setNewAddressWindow(!newAddressWindow)}
      >
        {newAddressWindow ? "View Saved Addresses" : "Add New Address"}
      </Button>

      {newAddressWindow && (
        <AddNewAddress setNewAddressWindow={setNewAddressWindow} userId={_id} />
      )}
    </div>
  );
};

export default UserProfile;
