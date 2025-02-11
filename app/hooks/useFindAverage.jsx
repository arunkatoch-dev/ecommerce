const useFindAverage = (productReviews) => {
  const averageRating =
    productReviews && productReviews.length > 0
      ? productReviews.reduce(
          (acc, productReview) => acc + productReview.rating,
          0
        ) / productReviews.length
      : 0;
  return averageRating;
};

export default useFindAverage;
