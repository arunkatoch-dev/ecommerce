"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUserSchema } from "@/validationSchemas/validation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
const inputErrorStyles =
  "py-2 border border-red-600 px-2 outline-red-600 rounded-lg";
const inputStyles =
  "py-2 border px-2 rounded-lg cursor-pointer outline-purple-900";
const errorStyles = "text-sm text-red-600 inline-block w-full text-center";

const SellerLogin = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const { Email, Password } = formData;
      const response = await axios.post("/auth/seller/login", {
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
        toast.success(data.message || "Login successfull");
        reset();
        router.push("/seller/dashboard");
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
      <div className="w-full md:w-[30%]  border rounded-xl bg-white shadow-2xl flex flex-col">
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
            className={`w-full rounded-full py-2 text-lg ${
              isPending
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-black/90"
            }`}
          >
            {isPending ? "Logging In..." : " Login as Seller"}
          </button>
        </form>
        <div className="px-4 py-3 w-full">
          <Link href="/seller/signup">
            <button className=" w-full rounded-full bg-purple-900 text-white cursor-pointer py-2 text-lg hover:bg-purple-900/90">
              Register as Seller
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-3 py-2">
          <Link
            href="/login"
            className="text-blue-600 cursor-pointer hover:text-blue-500"
          >
            Login as Customer
          </Link>
          <span>|</span>
          <Link
            href="/seller/password-reset"
            className="text-blue-600 cursor-pointer hover:text-blue-500"
          >
            forgot password
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1200} />
    </div>
  );
};

export default SellerLogin;
