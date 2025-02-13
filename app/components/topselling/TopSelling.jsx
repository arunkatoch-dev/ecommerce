"use client";
import Image from "next/image";
import Link from "next/link";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import UseTopSelling from "@/app/hooks/useProductsQuery";
import dynamic from "next/dynamic";
const StarRating = dynamic(() => import("../StarRatings/StarRating"), {
  loading: () => <Loader />,
});

const TopSelling = () => {
  // Query for fetching top-selling products
  const { data, isLoading, error } = UseTopSelling({
    page: 1,
    limit: 4,
    sortField: "title",
    sortOrder: "asc",
  });

  return (
    <section className="w-full flex flex-col py-16 px-24 border-b">
      {isLoading ? (
        <div className="w-full h-[30vh] md:h-[50vh]">
          <Loader />
        </div>
      ) : error ? (
        <Error message={error?.message || "An error occurred."} />
      ) : (
        <>
          <span className="inline-flex items-center justify-center text-3xl md:text-5xl font-bold uppercase md:pb-12">
            Top Selling
          </span>
          <div className="w-full py-4 flex flex-wrap lg:flex-nowrap items-center justify-center gap-12 md:gap-4">
            {data?.products?.map((product) => {
              const afterDiscountPrice =
                product.price - (product.price * product.discount) / 100;
              return (
                <div
                  key={product._id}
                  className="flex flex-col items-center justify-center py-4 cursor-pointer md:w-[295px] h-[400px] shadow-xl md:shadow-none"
                >
                  <Link href={`/topselling/${product._id}`}>
                    <div className="relative w-[295px] h-[298px] md:w-[295px] md:h-[298px]">
                      <Image
                        src={product.variants[0]?.images[0]?.url}
                        alt={product.title}
                        fill
                        style={{ objectFit: "contain", borderRadius: "15px" }}
                        loading="lazy"
                        sizes="295px"
                      />
                    </div>

                    <div className="w-full flex flex-col items-start gap-2 justify-start p-2">
                      <span className="text-base font-bold">
                        {product.title}
                      </span>
                      <StarRating rating={product.rating} />
                      <div className="flex gap-2 items-center py-1">
                        <span className="text-base font-bold">
                          &#8377; {afterDiscountPrice}
                        </span>
                        <span className="text-lg font-semibold line-through text-gray-500">
                          &#8377; {product.price}
                        </span>
                        <span className="inline-flex items-center justify-center bg-red-200 text-red-500 text-sm px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="w-full flex items-center justify-center py-9">
            <button className="w-[218px] h-[52px] flex items-center justify-center hover:text-gray-600 rounded-full border font-semibold">
              <Link href="/topselling">View All</Link>
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default TopSelling;
