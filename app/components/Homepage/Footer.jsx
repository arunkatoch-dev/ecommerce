import Image from "next/image";
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full md:h-[589px] px-2 md:px-24 items-center justify-center  relative bg-[#F0F0F0] mt-20">
      <div className="rounded-lg  bg-black text-white flex flex-col md:flex-row justify-between p-11 absolute -top-20 left-0 md:left-auto w-full md:w-[85%]">
        <div className="flex flex-col w-full md:w-1/2">
          <p className="font-bold text-4xl text-white uppercase tracking-tighter">
            Stay Upto about Our Latest Offers
          </p>
        </div>
        <div className="w-full pt-4 md:pt-0  md:w-[35%] flex flex-col gap-3">
          <input
            type="text"
            className="w-full p-2 border-none outline-none rounded-full"
            placeholder="Enter your Email address"
          />
          <button className="w-full p-2 flex items-center rounded-full justify-center bg-white text-black font-semibold">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      <div className="w-full pt-72 px-2 md:px-0 md:pt-36 pb-12 flex flex-col lg:flex-row flex-wrap md:flex-nowrap items-center justify-between border-b border-[#000000]/10 ">
        <div className="flex w-full lg:w-1/5 flex-col justify-between">
          <span className="uppercase font-bold tracking-tighter text-3xl">
            Shop.co
          </span>
          <span className="text-sm text-[#000000]/60 pt-[25px]">
            we have cloths that suits your style and which you're proud to wear.
            From women to men.
          </span>
          <div className="flex gap-2 items-center pt-[35px]">
            <div className="  flex items-center justify-center p-2 rounded-full border">
              <FaTwitter className="w-[28px] h-[28px] text-black" />
            </div>
            <div className="  flex items-center justify-center p-2 rounded-full border">
              <FaFacebook className="w-[28px] h-[28px] text-black" />
            </div>
            <div className="  flex items-center justify-center p-2 rounded-full border">
              <FaInstagram className="w-[28px] h-[28px] text-black" />
            </div>
            <div className="  flex items-center justify-center p-2 rounded-full border">
              <FaGithub className="w-[28px] h-[28px] text-black" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap py-5 px-3 gap-8 md:justify-between items-center md:flex-nowrap">
          <div className="h-full gap-6 flex flex-col justify-center">
            <span className="text-base font-medium">Company</span>
            <span className="text-black/60">About</span>
            <span className="text-black/60">Features</span>
            <span className="text-black/60">Works</span>
            <span className="text-black/60">Career</span>
          </div>
          <div className="h-full gap-6 flex flex-col justify-between">
            <span className="text-base font-medium">Help</span>
            <span className="text-black/60">Customer Support</span>
            <span className="text-black/60">Delivery Details</span>
            <span className="text-black/60">Terms & Conditions</span>
            <span className="text-black/60">Privacy Policy</span>
          </div>
          <div className="h-full gap-6 flex flex-col justify-between">
            <span className="text-base font-medium">FAQ</span>
            <span className="text-black/60">Account</span>
            <span className="text-black/60">Manage Deliveries</span>
            <span className="text-black/60">Orders</span>
            <span className="text-black/60">Payments</span>
          </div>
          <div className="h-full gap-6 flex flex-col justify-between">
            <span className="text-base font-medium">Resources</span>
            <span className="text-black/60">Free eBooks</span>
            <span className="text-black/60">Development Tutorial</span>
            <span className="text-black/60">How to - Blog</span>
            <span className="text-black/60">YouTube Playlist</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start items-center justify-between py-6">
        <span className="text-[#000000]/60">
          Shop.co &copy; 2025-2026, All Rights Reserverd
        </span>
        <div className="relative w-[281px] h-[30px] lg:h-[45px]">
          <Image
            src="/paymentMethods.png"
            alt="payment methods Logos"
            fill
            style={{ objectFit: "contain" }}
            loading="lazy"
            sizes="281px"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
