"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProductImages = ({ productImages }) => {
  const [zoomedImage, setZoomedImage] = useState("/placeholder.jpg");

  useEffect(() => {
    setZoomedImage(productImages?.images[0].url);
  }, [productImages]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {/* Main Image */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[450px] h-[300px] md:h-[500px] relative rounded-lg">
          <Image
            src={zoomedImage || "/placeholder.jpg"}
            alt="product-zoomed-image"
            fill
            loading="lazy"
            className="object-cover rounded-lg"
            sizes="500px"
          />
        </div>

        {/* Thumbnails (Below Image on Small Screens) */}
        <div className="w-full flex gap-2 mt-4 justify-center md:hidden overflow-x-auto">
          {productImages &&
            productImages.images.map((image, index) => (
              <div
                key={index}
                className="w-[80px] h-[80px] relative rounded-lg cursor-pointer border hover:border-black transition"
                onClick={() => setZoomedImage(image.url)}
              >
                <Image
                  src={image.url || "/placeholder.jpg"}
                  alt="product-thumbnail"
                  fill
                  loading="lazy"
                  className="object-cover rounded-lg"
                  sizes="80px"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Thumbnails (Left Side on Large Screens) */}
      <div className="hidden md:flex md:w-1/3 flex-col gap-2 overflow-y-auto">
        {productImages &&
          productImages.images.map((image, index) => (
            <div
              key={index}
              className="w-[120px] h-[140px] relative rounded-lg cursor-pointer border hover:border-black transition"
              onClick={() => setZoomedImage(image.url)}
            >
              <Image
                src={image.url || "/placeholder.jpg"}
                alt="product-thumbnail"
                fill
                loading="lazy"
                className="object-cover rounded-lg"
                sizes="120px"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductImages;
