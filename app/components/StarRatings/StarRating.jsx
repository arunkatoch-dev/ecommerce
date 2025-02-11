import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({ rating = 0, showNumeric = true }) {
  const ratingStar = Array.from({ length: 5 }, (_, index) => {
    let number = index + 0.5;
    return (
      <span key={index}>
        {rating >= index + 1 ? (
          <FaStar className="text-yellow-400" />
        ) : rating >= number ? (
          <FaStarHalfAlt className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-yellow-400" />
        )}
      </span>
    );
  });

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center gap-2">{ratingStar}</div>
      {showNumeric && <span className="text-gray-600 text-sm">{rating}/5</span>}
    </div>
  );
}
