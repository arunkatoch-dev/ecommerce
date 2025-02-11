"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
const inputStyles =
  "py-2 border px-2 rounded-lg cursor-pointer outline-purple-900";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/auth/user/password-reset", {
        email,
      });
      return response.data;
    },
    onMutate: () => {
      return toast.loading("sending link...");
    },
    onSuccess: (data, variables, context) => {
      if (!data.success) {
        toast.dismiss(context);
        toast.error(data.message || "something went wrong");
        setEmail("");
      } else {
        toast.dismiss(context);
        toast.success(data.message || "Password Reset Link Send Successfully");
        setEmail("");
      }
    },
    onError: (error, variables, context) => {
      toast.dismiss(context);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setEmail("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="w-full flex items-center justify-center h-screen p-3 bg-slate-200">
      <div className="w-full md:w-[30%]  border rounded-xl bg-white shadow-2xl flex flex-col">
        <span className="inline-flex items-center justify-center text-2xl text-center w-full py-3 font-bold uppercase">
          Enter your credentials
        </span>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full h-full gap-5 px-4 pt-5"
          autoComplete="off"
        >
          <div className="flex flex-col gap-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={inputStyles}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-black text-white hover:cursor-pointer py-2 text-lg hover:bg-black/90"
          >
            {isPending ? "Sending Link..." : " Send Link "}
          </button>
        </form>
        <div className="px-4 py-3 w-full">
          <Link href="/login">
            <button className=" w-full rounded-full bg-purple-900 text-white cursor-pointer py-2 text-lg hover:bg-purple-900/90">
              Login
            </button>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1200} />
    </div>
  );
};

export default PasswordResetPage;
