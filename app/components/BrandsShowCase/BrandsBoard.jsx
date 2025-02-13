import Image from "next/image";

const BrandsBoard = () => {
  return (
    <section className="w-full gap-6 px-4 lg:gap-0 py-6 lg:py-11 lg:px-24 flex flex-wrap justify-between items-center bg-black">
      <div className="relative w-[117px]  h-[24px] lg:w-[168px] lg:h-[34px]">
        <Image
          src="/brands/versace-logo.png"
          alt="versace logo"
          fill
          loading="lazy"
          style={{ objectFit: "contain" }}
          sizes="168px"
        />
      </div>
      <div className="relative w-[64px] h-[27px] lg:w-[91px] lg:h-[34px]">
        <Image
          src="/brands/zara-logo.png"
          alt="zara logo"
          fill
          loading="lazy"
          style={{ objectFit: "contain" }}
          sizes="91px"
        />
      </div>
      <div className="relative w-[110px] h-[26px] lg:w-[156px] lg:h-[34px]">
        <Image
          src="/brands/gucci-logo.png"
          alt="gucci logo"
          fill
          loading="lazy"
          style={{ objectFit: "contain" }}
          sizes="156px"
        />
      </div>
      <div className="relative w-[127px] h-[21px] lg:w-[194px] lg:h-[34px]">
        <Image
          src="/brands/prada-logo.png"
          alt="prada logo"
          fill
          loading="lazy"
          style={{ objectFit: "contain" }}
          sizes="194px"
        />
      </div>
      <div className="relative w-[135px] h-[22px] lg:w-[206px] lg:h-[34px]">
        <Image
          src="/brands/calvinklein-logo.png"
          alt="calvin klein logo"
          fill
          loading="lazy"
          style={{ objectFit: "contain" }}
          sizes="206px"
        />
      </div>
    </section>
  );
};

export default BrandsBoard;
