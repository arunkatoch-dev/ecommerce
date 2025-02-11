"use client";
import { useForm } from "react-hook-form";
import { useSellerData } from "./SellerDataProvider";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { yupResolver } from "@hookform/resolvers/yup";
import { sellerProfileSchema } from "@/validationSchemas/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
const Field = dynamic(() => import("./form_components/Field"), {
  loading: () => <Loader />,
});

const EditSellerProfile = () => {
  const { data, isLoading, error } = useSellerData();
  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sellerProfileSchema),
  });

  const {
    _id,
    name,
    email,
    phone,
    bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
    address: { street, city, state, zipCode, country },
    businessName,
    businessLicenseNumber,
  } = data.seller;
  const queryClient = useQueryClient(); // Access the query client
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.patch("/auth/seller/profile", {
        _id,
        ...formData,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "something went wrong");
        reset();
      } else {
        toast.success(data.message || "Profile updated");
        // Invalidate the "sellerData" query to fetch updated data
        queryClient.invalidateQueries(["userData"]);
        reset();
        router.push("/seller/dashboard/profile");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      reset();
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  const personalInformation = [
    {
      label: "Name",
      toRegister: "name",
      defaultValue: name,
      placeholder: "Enter your Name",
    },
    {
      label: "Email",
      toRegister: "email",
      defaultValue: email,
      placeholder: "Enter your Email",
    },
    {
      label: "Phone",
      toRegister: "phone",
      defaultValue: phone,
      placeholder: "Enter your Phone Number",
    },
  ];

  const address = [
    {
      label: "Street",
      toRegister: "street",
      defaultValue: street,
      placeholder: "Enter your Street",
    },
    {
      label: "City",
      toRegister: "city",
      defaultValue: city,
      placeholder: "Enter your City",
    },
    {
      label: "State",
      toRegister: "state",
      defaultValue: state,
      placeholder: "Enter your State",
    },
    {
      label: "ZipCode",
      toRegister: "zipCode",
      defaultValue: zipCode,
      placeholder: "Enter your zip code",
    },
    {
      label: "Country",
      toRegister: "country",
      defaultValue: country,
      placeholder: "Enter your country",
    },
  ];

  const businessDetails = [
    {
      label: "Business Name",
      toRegister: "businessName",
      defaultValue: businessName,
      placeholder: "Enter your business name",
    },
    {
      label: "Licence Number",
      toRegister: "businessLicenseNumber",
      defaultValue: businessLicenseNumber,
      placeholder: "Enter your business Licence Number",
    },
  ];
  const bankDetails = [
    {
      label: "Account Holder Name",
      toRegister: "accountHolderName",
      defaultValue: accountHolderName,
      placeholder: "Enter your Account Holder Name",
    },
    {
      label: "Account Number",
      toRegister: "accountNumber",
      defaultValue: accountNumber,
      placeholder: "Enter your Account Number",
    },
    {
      label: "Bank Name",
      toRegister: "bankName",
      defaultValue: bankName,
      placeholder: "Enter your Bank Name ",
    },
    {
      label: "IFSC Code",
      toRegister: "ifscCode",
      defaultValue: ifscCode,
      placeholder: "Enter your IFSC Code ",
    },
  ];
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="space-y-6 p-6 bg-white shadow-md rounded-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      {personalInformation?.map((personaldetails) => {
        const { label, toRegister, placeholder, defaultValue } =
          personaldetails;
        return (
          <Field
            key={toRegister}
            register={register}
            label={label}
            toRegister={toRegister}
            defaultValue={defaultValue}
            errors={errors}
            placeholder={placeholder}
          />
        );
      })}
      <h2 className="text-2xl font-bold mt-6 mb-4">Address</h2>
      {address?.map((sellerAddress) => {
        const { label, toRegister, placeholder, defaultValue } = sellerAddress;
        return (
          <Field
            key={toRegister}
            register={register}
            label={label}
            toRegister={toRegister}
            defaultValue={defaultValue}
            errors={errors}
            placeholder={placeholder}
          />
        );
      })}

      <h2 className="text-2xl font-bold mt-6 mb-4">Business Information</h2>

      {businessDetails?.map((businessdetails) => {
        const { label, toRegister, placeholder, defaultValue } =
          businessdetails;
        return (
          <Field
            key={toRegister}
            register={register}
            label={label}
            toRegister={toRegister}
            defaultValue={defaultValue}
            errors={errors}
            placeholder={placeholder}
          />
        );
      })}
      <h2 className="text-2xl font-bold mt-6 mb-4">Bank Details</h2>
      {bankDetails?.map((bankdetails) => {
        const { label, toRegister, placeholder, defaultValue } = bankdetails;
        return (
          <Field
            key={toRegister}
            register={register}
            label={label}
            toRegister={toRegister}
            defaultValue={defaultValue}
            errors={errors}
            placeholder={placeholder}
          />
        );
      })}
      <div className="flex w-full items-center justify-center">
        <button
          type="submit"
          disabled={isPending}
          className={`w-full rounded-full py-2 text-lg ${
            isPending
              ? "bg-purple-400 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white "
          }`}
        >
          {isPending ? "Updating..." : "Complete Profile"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={800} />
    </form>
  );
};

export default EditSellerProfile;
