"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const inputErrorStyles =
  "py-2 border border-red-600 px-2 outline-red-600 rounded-lg";
const inputStyles =
  "py-2 border px-2 rounded-lg cursor-pointer outline-purple-900";
const errorStyles = "text-sm text-red-600 inline-block w-full text-center";

const AuthLoginForm = ({
  validationSchema,
  endpoint,
  redirectPath,
  mainButtonText,
  altButtonText,
  altButtonHref,
  switchText,
  switchHref,
  forgotPasswordHref,
  forgotPasswordText,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      const { Email, Password } = formData;
      const response = await axios.post(endpoint, {
        email: Email,
        password: Password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "something went wrong");
        reset();
      } else {
        toast.success(data.message || "Login successful");
        queryClient.invalidateQueries();
        reset();
        router.push(redirectPath);
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
          Enter your credentials
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full h-full gap-5 px-4 pt-5"
          autoComplete="off"
        >
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className={errors.Email ? inputErrorStyles : inputStyles}
              {...register("Email")}
            />
            {errors.Email && (
              <span className={errorStyles}>{errors.Email.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              placeholder="Password"
              className={errors.Password ? inputErrorStyles : inputStyles}
              {...register("Password")}
            />
            {errors.Password && (
              <span className={errorStyles}>{errors?.Password?.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-black text-white hover:cursor-pointer py-2 text-lg hover:bg-black/90"
          >
            {isPending ? "Logging In..." : mainButtonText}
          </button>
        </form>
        <div className="px-4 py-3 w-full">
          <Link href={altButtonHref}>
            <button className="w-full rounded-full bg-purple-900 text-white cursor-pointer py-2 text-lg hover:bg-purple-900/90">
              {altButtonText}
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          <Link
            href={switchHref}
            className="text-blue-600 cursor-pointer hover:text-blue-500"
          >
            {switchText}
          </Link>
          <span>|</span>
          <Link
            href={forgotPasswordHref}
            className="text-blue-600 cursor-pointer hover:text-blue-500"
          >
            {forgotPasswordText}
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1200} />
    </div>
  );
};

export default AuthLoginForm; 