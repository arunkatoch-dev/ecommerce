"use client";
import React, { useState } from "react";
import ReactStars from "react-stars";
import Error from "../Error/Error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import StarRating from "../StarRatings/StarRating";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";

const fetchProductReview = async (productId, userId) => {
  const response = await axios.get(
    `/products/ratings/rating?productId=${productId}&userId=${userId}`
  );
  return response.data;
};

const addProductReview = async (productId, userId, newRating, newReview) => {
  const response = await axios.post(`/products/ratings`, {
    productId,
    userId,
    rating: newRating,
    review: newReview,
  });
  return response.data;
};
const updateProductReview = async (ratingId, review, rating) => {
  const response = await axios.patch(
    `/products/ratings/rating?ratingId=${ratingId}`,
    {
      rating,
      review,
    }
  );
  return response.data;
};

const deleteProductReview = async (ratingId) => {
  const response = await axios.delete(
    `/products/ratings/rating?ratingId=${ratingId}`
  );
  return response.data;
};

const UserProductReview = ({ productId, userId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedReview, setEditedReview] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const queryClient = useQueryClient();
  const [userRating, setUserRating] = useState(0);
  const [newReview, setNewReview] = useState("");

  if (!productId || !userId) {
    return <Error message="userId and productId is missing" />;
  }

  const { isLoading, data, error } = useQuery({
    queryKey: ["userProductReview", productId, userId],
    queryFn: () => fetchProductReview(productId, userId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: false,
  });

  const handleEditClick = () => {
    setEditedReview(data?.rating?.review);
    setEditedRating(data?.rating?.rating);
    setIsDialogOpen(true);
  };

  const { mutate: mutateEditReview, isPending: isReviewUpdationPending } =
    useMutation({
      mutationFn: (ratingId) =>
        updateProductReview(ratingId, editedReview, editedRating),
      onMutate: () => toast.loading("Updating your review..."),
      onSuccess: (data, variables, context) => {
        toast.dismiss(context);
        if (!data.success) {
          toast.error(data.message || "Something went wrong");
        } else {
          toast.success(data.message || "Review updated...");
          queryClient.invalidateQueries([
            "userProductReview",
            data.productId,
            data.userId,
          ]);
        }
      },
      onError: (error, variables, context) => {
        toast.dismiss(context);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
      },
    });
  const { mutate: mutateAddReview, isPending: isAddReviewPending } =
    useMutation({
      mutationFn: () =>
        addProductReview(productId, userId, userRating, newReview),
      onMutate: () => toast.loading("review adding..."),
      onSuccess: (data, variables, context) => {
        toast.dismiss(context);
        if (!data.success) {
          toast.error(data.message || "Something went wrong");
        } else {
          toast.success(data.message || "Review added...");
          queryClient.invalidateQueries([
            "userProductReview",
            data.productId,
            data.userId,
          ]);
        }
      },
      onError: (error, variables, context) => {
        toast.dismiss(context);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
      },
    });

  const { mutate: mutateDeleteReview, isPending: isReviewDeletionPending } =
    useMutation({
      mutationFn: (ratingId) => deleteProductReview(ratingId),
      onMutate: () => toast.loading("Deleting your review..."),
      onSuccess: (data, variables, context) => {
        toast.dismiss(context);
        if (!data.success) {
          toast.error(data.message || "Something went wrong");
        } else {
          toast.success(data.message || "Review deleted...");
          queryClient.invalidateQueries([
            "userProductReview",
            data.productId,
            data.userId,
          ]);
        }
      },
      onError: (error, variables, context) => {
        toast.dismiss(context);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
      },
    });

  const handleSave = (ratingId) => {
    mutateEditReview(ratingId, editedReview, editedRating);
    setIsDialogOpen(false);
  };

  const handleAddNewRating = () => {
    if (userRating < 1 && userRating >= 5) {
      return toast.error("Min 1 Star is required...");
    }
    mutateAddReview();
  };
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = (ratingId) => {
    mutateDeleteReview(ratingId);
    setIsDeleteDialogOpen(false);
  };
  const ratingChanged = (newRating) => {
    setUserRating(newRating);
  };

  return (
    <div className="w-full py-5">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {data?.message === "Rating not found" || !data?.success ? (
            <div className="w-full flex flex-col">
              <p className="text-lg font-bold py-3">Add Review</p>
              <div className="px-2 py-3 flex flex-col items-start gap-4">
                <ReactStars
                  count={5}
                  // value={newRating}
                  onChange={ratingChanged}
                  size={40}
                  half={false}
                  color2={"#ffd700"}
                />
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Write your review here..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />
                <Button
                  disabled={isAddReviewPending}
                  onClick={handleAddNewRating}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col border p-2">
              <div className="flex justify-between items-center px-3">
                <span className="text-lg font-bold py-3">Your Review:</span>
                <div className="flex items-center space-x-4">
                  <MdEdit
                    className="text-lg cursor-pointer text-black hover:text-black/70"
                    onClick={handleEditClick}
                  />
                  <MdDelete
                    className="text-lg cursor-pointer text-red-500 hover:text-red-700"
                    onClick={handleDeleteClick}
                  />
                </div>
              </div>

              <p className="font-semibold">{data?.rating?.userId?.email}</p>
              <p>{data?.rating?.review}</p>
              <p className="text-sm pt-4 pb-1 font-semibold ">
                {new Date(data?.rating?.createdAt).toLocaleString("en-US", {
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
              <StarRating rating={data?.rating?.rating} />

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Your Review</DialogTitle>
                  </DialogHeader>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={editedReview}
                    onChange={(e) => setEditedReview(e.target.value)}
                  />
                  <div className="py-3">
                    <ReactStars
                      count={5}
                      value={editedRating}
                      onChange={setEditedRating}
                      size={40}
                      half={false}
                      color2={"#ffd700"}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isReviewUpdationPending}
                      onClick={() => {
                        handleSave(data?.rating?._id);
                      }}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to delete this review?</p>
                  <DialogFooter>
                    <Button
                      onClick={() => setIsDeleteDialogOpen(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isReviewDeletionPending}
                      onClick={() => {
                        confirmDelete(data?.rating?._id);
                      }}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default UserProductReview;
