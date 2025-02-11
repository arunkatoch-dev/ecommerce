import StarRating from "../StarRatings/StarRating";

const customerReviews = [
  {
    id: 1,
    user: "John Doe",
    rating: 5,
    review:
      "I love the product. It's amazing. I would recommend it to everyone. I would recommend it to everyone. I would recommend it to everyone I would recommend it to everyone.. I would recommend it to everyone. I would recommend it to everyone. I love the product. It's amazing. I would recommend it to everyone.",
  },
  {
    id: 2,
    user: "Lorem Bro",
    rating: 5,
    review:
      "I love the product. It's amazing. I would recommend it to everyone. I love the product. It's amazing. I would recommend it to everyone.",
  },
  {
    id: 3,
    user: " Doe John",
    rating: 5,
    review:
      "I love the product. It's amazing. I would recommend it to everyone. I love the product. It's amazing. I would recommend it to everyone.",
  },
];

const HappyCustomers = () => {
  return (
    <section className="w-full px-2 lg:px-24 flex flex-col">
      <span className="text-5xl font-bold uppercase tracking-tighter">
        our happy customers
      </span>
      <div className="w-full py-10  flex flex-col lg:flex-row gap-5">
        {customerReviews.map((reviewDetail) => {
          const { id, user, rating, review } = reviewDetail;
          let userReview = review.slice(0, 100);
          return (
            <div
              key={id}
              className="flex flex-col gap-4 p-7 border rounded-lg w-full lg:w-[400px] h-[240px]"
            >
              <StarRating rating={rating} showNumeric={false} />
              <p className="text-2xl font-semibold">{user}</p>
              <p className="text-base text-gray-600">{userReview}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HappyCustomers;
