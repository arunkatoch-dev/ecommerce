"use client";
import Link from "next/link";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
import { useSellerData } from "./SellerDataProvider";
import { FaArrowRight } from "react-icons/fa";
function Dashboard() {
  const { data, isLoading, error } = useSellerData();
  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;
  const {
    name,
    email,
    phone,
    bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
    address: { street, city, state, zipCode, country },
    businessName,
    businessLicenseNumber,
    isVerified,
  } = data.seller;

  const isProfileIncomplete = !(
    name &&
    phone &&
    email &&
    businessName &&
    businessLicenseNumber &&
    accountHolderName &&
    accountNumber &&
    bankName &&
    ifscCode &&
    street &&
    city &&
    state &&
    zipCode &&
    country
  );
  return (
    <section className="flex flex-col items-center gap-5 justify-center w-full h-full">
      <div className="flex gap-2 items-center">
        <p className="text-4xl font-bold uppercase">Welcome:</p>
        <span className="text-4xl font-bold uppercase text-purple-700">
          {name}
        </span>
      </div>

      {isProfileIncomplete && (
        <Link href="/seller/dashboard/editProfile">
          <button className="text-white bg-purple-800 hover:bg-purple-700 cursor-pointer font-bold px-4 py-2 text-lg rounded-2xl flex gap-3 items-center justify-center">
            Complete your Profile <FaArrowRight />
          </button>
        </Link>
      )}

      {!isVerified ? (
        <button className="text-white bg-purple-800 hover:bg-purple-700 cursor-pointer font-bold px-4 py-2 text-lg rounded-2xl">
          Verify your email first
        </button>
      ) : null}
    </section>
  );
}

export default Dashboard;
