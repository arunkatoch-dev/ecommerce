"use client";
import dynamic from "next/dynamic";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
const StarRating = dynamic(() => import("../StarRatings/StarRating"), {
  loading: () => <Loader />,
});

const ProductReviews = ({
  averageRating = 0,
  productReviews,
  isReviewsLoading,
  reviewsError,
}) => {
  return (
    <section className="py-12 flex flex-col">
      <span className="text-3xl font-bold uppercase pb-7">Product Reviews</span>
      <p className="text-lg font-bold uppercase">Average</p>
      <div className="flex gap-3 items-center py-2">
        <StarRating rating={averageRating} />
        <span className="text-gray-700">({productReviews?.length})</span>
      </div>
      {isReviewsLoading ? (
        <Loader />
      ) : reviewsError ? (
        <Error message={reviewsError.message} />
      ) : (
        <>
          {productReviews?.length > 0 ? (
            <div className="flex flex-col gap-3 p-2 ">
              {productReviews?.map((productReview) => {
                const { _id, userId, review, rating, createdAt } =
                  productReview;
                const userName = userId.email.split("@");
                return (
                  <div key={_id} className="flex flex-col border-b pb-2">
                    <p className="font-semibold">{userName[0]}</p>
                    <p>{review}</p>
                    <p className="text-sm">
                      {new Date(createdAt).toLocaleString("en-US", {
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
                    <StarRating rating={rating} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center animate-bounce">
              No Reviews found.
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductReviews;
