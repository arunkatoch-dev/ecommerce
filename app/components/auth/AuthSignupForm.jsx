"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inputErrorStyles =
  "py-2 border border-red-600 px-2 outline-red-600 rounded-lg";
const inputStyles =
  "py-2 border px-2 rounded-lg cursor-pointer outline-purple-900";
const errorStyles = "text-sm text-red-600 inline-block w-full text-center";

const AuthSignupForm = ({
  validationSchema,
  endpoint,
  redirectPath,
  fields,
  mainButtonText,
  altButtonText,
  altButtonHref,
  switchText,
  switchHref,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      // Build payload dynamically based on fields
      const payload = {};
      fields.forEach((field) => {
        payload[field.apiKey] = formData[field.name];
      });
      const response = await axios.post(endpoint, payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "something went wrong");
        reset();
      } else {
        toast.success(data.message || "Signup successful!");
        reset();
        if (redirectPath) router.push(redirectPath);
      }
    },
    onError: (error) => {
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

  return (
    <div className="w-full flex items-center justify-center h-screen p-3 bg-slate-200">
      <div className="w-full md:w-[30%] border rounded-xl bg-white shadow-2xl flex flex-col">
        <span className="inline-flex items-center justify-center text-2xl text-center w-full py-3 font-bold uppercase">
          Enter your details
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full h-full gap-5 px-4 pt-5"
          autoComplete="off"
        >
          {fields.map((field) => (
            <div className="flex flex-col gap-2" key={field.name}>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={errors[field.name] ? inputErrorStyles : inputStyles}
                {...register(field.name)}
              />
              {errors[field.name] && (
                <span className={errorStyles}>{errors[field.name]?.message}</span>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-black text-white hover:cursor-pointer py-2 text-lg hover:bg-black/90"
          >
            {isPending ? "Submitting..." : mainButtonText}
          </button>
        </form>
        <div className="px-4 py-3 w-full">
          <Link href={altButtonHref}>
            <button className="w-full rounded-full bg-purple-900 text-white cursor-pointer py-2 text-lg hover:bg-purple-900/90">
              {altButtonText}
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-2">
          <Link
            href={switchHref}
            className="text-blue-600 cursor-pointer hover:text-blue-500"
          >
            {switchText}
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1200} />
    </div>
  );
};

export default AuthSignupForm; 