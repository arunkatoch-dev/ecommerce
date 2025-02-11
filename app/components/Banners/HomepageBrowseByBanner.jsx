import Image from "next/image";
import React from "react";

const HomepageBrowseByBanner = () => {
  return (
    <section className="w-full px-2 lg:px-24 pb-16">
      <div className="w-full flex flex-col md:items-center md:justify-center bg-[#F0F0F0] rounded-2xl ">
        <h2 className="pt-5  md:py-16 text-center uppercase font-bold text-5xl">
          browse by dress style
        </h2>
        <div className="w-full flex flex-col md:items-center md:justify-center gap-3 md:pb-16">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-center w-full">
            <div className="relative w-full h-[289px] md:w-[395px] md:h-[289px]">
              <Image
                src="/dressStyles/casual.png"
                alt="casual"
                priority
                fill
                style={{ objectFit: "contain", borderRadius: "15px" }}
                sizes="395px"
              />
            </div>
            <div className="relative w-full h-[150px] md:w-[670px] md:h-[289px]">
              <Image
                src="/dressStyles/formal.png"
                alt="formal"
                priority
                fill
                style={{ objectFit: "contain", borderRadius: "15px" }}
                sizes="670px"
              />
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-3 items-center justify-center">
            <div className="relative w-full h-[150px] md:w-[670px] md:h-[289px]">
              <Image
                src="/dressStyles/party.png"
                alt="party"
                priority
                fill
                style={{ objectFit: "contain", borderRadius: "15px" }}
                sizes="670px"
              />
            </div>
            <div className="relative w-full h-[289px] md:w-[395px] md:h-[289px]">
              <Image
                src="/dressStyles/gym.png"
                alt="gym"
                priority
                fill
                style={{ objectFit: "contain", borderRadius: "15px" }}
                sizes="395px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageBrowseByBanner;
