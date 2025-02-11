"use client";
import Loader from "../Loader/Loader";
import { useSellerData } from "./SellerDataProvider";
import Error from "../Error/Error";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const SellerProfile = () => {
  const { data, isLoading, error } = useSellerData();
  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center h-[50vh]">
        <Loader />
      </div>
    );
  if (error) return <Error message={error.message} />;

  const {
    name,
    email,
    phone,
    bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
    address: { street, city, state, zipCode, country },
    businessName,
    businessLicenseNumber,
    isActive,
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
    <section className="flex flex-col p-5 w-full bg-white shadow-md rounded-md">
      {isProfileIncomplete && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-5 flex justify-between"
          role="alert"
        >
          <div className="flex flex-col gap-2">
            <p className="font-bold">Incomplete Profile</p>
            <p>Please complete your profile information.</p>
          </div>
          <Link
            href="/seller/dashboard/editProfile"
            className="text-lg font-bold hover:text-yellow-600 cursor-pointer inline-flex gap-2 items-center"
          >
            Complete your Profile <FaArrowRight />
          </Link>
        </div>
      )}
      <div className="flex items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-600">{phone}</p>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Business Information</h2>
        <p className="text-gray-600">Business Name: {businessName}</p>
        <p className="text-gray-600">License Number: {businessLicenseNumber}</p>
        <p className="text-gray-600">
          Status: {isActive ? "Active" : "Inactive"}
        </p>
      </div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Bank Details</h2>
        <p className="text-gray-600">
          Account Holder Name: {accountHolderName}
        </p>
        <p className="text-gray-600">Account Number: {accountNumber}</p>
        <p className="text-gray-600">Bank Name: {bankName}</p>
        <p className="text-gray-600">IFSC Code: {ifscCode}</p>
      </div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Address</h2>
        <p className="text-gray-800 font-bold">
          Street: <span className="text-gray-600 font-normal">{street}</span>
        </p>
        <p className="text-gray-600">City: {city}</p>
        <p className="text-gray-600">State: {state}</p>
        <p className="text-gray-600">Zipcode: {zipCode}</p>
        <p className="text-gray-600">Country: {country}</p>
      </div>
    </section>
  );
};

export default SellerProfile;
