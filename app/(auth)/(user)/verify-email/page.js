"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Link from "next/link";

const verifyUserEmail = async (token) => {
  const response = await axios.get(`/auth/user/verify-email`, {
    params: { token },
  });
  return response.data;
};

export default function VerifyUserEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (userEmail) => {
      const response = await axios.post(
        "/auth/user/generate-new-email-verify-token",
        {
          email: userEmail,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "something went wrong");
        setUserEmail("");
      } else {
        toast.success(data.message || "token generate successfully");
        setUserEmail("");
        router.push("/login");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setUserEmail("");
    },
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["verifyUserEmail", token],
    queryFn: () => verifyUserEmail(token),
    enabled: false, // Prevent automatic fetching until token is available
    retry: false, // Disable retrying on error
  });

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
      return;
    }

    // Trigger the query manually when the token is available
    refetch();
  }, [token, refetch]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (isError || errorMessage) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-3">
        <h1 className="text-lg text-red-500">Email Verification Failed</h1>
        <p className="text-gray-800">
          {errorMessage || "The verification link is invalid or has expired."}
        </p>
        <div className="flex items-center justify-center gap-2 w-full">
          <input
            type="email"
            required
            name="userEmail"
            value={userEmail}
            placeholder="Enter your email"
            autoComplete="off"
            onChange={(e) => {
              e.preventDefault();
              setUserEmail(e.target.value);
            }}
            className="border border-gray-300 w-[20%] px-2 py-1"
          />
          <button
            disabled={isPending}
            type="submit"
            className="px-4 py-1 text-lg bg-purple-800 text-white hover:bg-purple-700"
            onClick={() => {
              if (userEmail.length < 5) {
                toast.error("Invalid email address");
                return;
              }
              mutate(userEmail);
            }}
          >
            {isPending ? "Generating Token..." : "Generate New Token"}
          </button>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-3">
      <h1 className="text-lg text-green-500">Email Verified Successfully</h1>
      <p className="text-gray-800">
        Thank you for verifying your email! You can now log in.
      </p>
      <Link href="/login" className="text-blue-500">
        Go to Login
      </Link>
    </div>
  );
}
