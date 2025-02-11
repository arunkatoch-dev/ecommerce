"use client";

import { useRouter } from "next/navigation";

const OrderSummary = ({ cart }) => {
  const router = useRouter();
  // Default values for discount and delivery charges
  const discount = cart?.discount || 0;
  const deliveryCharges = 0;

  // Calculate the total dynamically
  const subtotal = cart?.totalPrice || 0; // Original total price
  const total = subtotal - discount + deliveryCharges;

  return (
    <div className="w-full sm:w-[80%] lg:w-[40%] h-auto lg:h-[70vh] rounded-2xl border gap-6 flex p-4 sm:p-6 flex-col">
      <span className="font-bold text-xl sm:text-2xl">Order Summary</span>
      {cart?.items?.length > 0 ? (
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg text-[#000000]/60">
              Subtotal
            </span>
            <span className="text-base sm:text-lg font-bold">
              &#8377; {subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg text-[#000000]/60">
              Discount
            </span>
            <span className="text-base sm:text-lg font-bold text-red-700">
              -&#8377; {discount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg text-[#000000]/60">
              Delivery Fee
            </span>
            <span className="text-base sm:text-lg font-bold">
              &#8377; {deliveryCharges}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 sm:py-4 border-t border-gray-300">
            <span className="text-lg sm:text-xl font-bold text-[#000000]">
              Total
            </span>
            <span className="text-lg sm:text-xl font-bold">
              &#8377; {total}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <input
              type="text"
              name="promoCode"
              placeholder="Add promo code"
              className="w-full sm:w-[70%] p-2 sm:p-3 rounded-full border"
              onChange={(e) => console.log(`Promo code: ${e.target.value}`)}
            />
            <button
              className="px-6 py-2 rounded-full flex items-center justify-center bg-black text-white"
              onClick={() => console.log("Apply promo code")}
            >
              Apply
            </button>
          </div>
          <button
            className={`w-full py-2 bg-purple-600 hover:bg-purple-600/90 text-white rounded-full ${
              cart?.items.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={() => router.push(`/cart/checkout/${cart?.user}`)}
            disabled={cart?.items?.length < 1}
          >
            Go to checkout
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-[#000000]/60">Nothing to show</span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
