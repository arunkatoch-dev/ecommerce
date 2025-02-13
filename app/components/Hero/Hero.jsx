"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

const Hero = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between bg-[#F2F0F1]">
      {/* Left Content */}
      <div className="w-full lg:w-[50%] lg:pl-24">
        <div className="flex flex-col leading-[1.0] px-4 pt-10 pb-5 lg:p-0 w-full lg:w-[577px] lg:h-[173px]">
          <span className="text-[36px] md:text-[64px] font-bold inline-block uppercase text-black">
            Find Clothes
          </span>
          <span className="text-[36px] lg:text-[64px] font-bold inline-block uppercase text-black">
            That Matches
          </span>
          <span className="text-[36px] lg:text-[64px] font-bold inline-block uppercase text-black">
            Your Style
          </span>
        </div>

        <p className="text-gray-800 text-base px-4 lg:px-0 lg:my-[32px] inline-block lg:w-[545px] lg:h-[33px]">
          Browse through our diverse range of meticulously crafted garments,
          designed to bring out your individuality and cater to your sense of
          style.
        </p>
        <Link
          href="/topselling"
          className="bg-black w-[95%] py-3 lg:py-0 mx-auto md:mx-0 my-5 lg:my-0 lg:w-[210px] lg:h-[52px] rounded-full text-white flex items-center justify-center text-base hover:bg-gray-800"
        >
          Shop Now
        </Link>
        <div className="flex w-full items-center justify-center lg:justify-normal flex-wrap lg:flex-nowrap gap-8 lg:mt-12 lg:w-[596px] lg:h-[74px]">
          <div className="flex flex-col">
            <span className="text-2xl lg:text-[40px] font-bold text-black">
              <CountUp end={200} />+
            </span>
            <p className="text-gray-800 text-xs md:text-base">
              International Brands
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl lg:text-[40px] font-bold text-black">
              <CountUp end={2000} />+
            </span>
            <p className="text-gray-800 text-xs md:text-base">
              High-Quality Products
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl lg:text-[40px] font-bold text-black">
              <CountUp end={30000} />+
            </span>
            <p className="text-gray-800 text-xs lg:text-base">
              Happy Customers
            </p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="relative w-full h-[448px] md:w-[695px] md:h-[663px]">
        <Image
          src="/heroImage.png"
          alt="hero image"
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, 695px"
        />
      </div>
    </div>
  );
};

export default Hero;
