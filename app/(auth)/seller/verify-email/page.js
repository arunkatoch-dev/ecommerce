"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const verifyEmail = async (token) => {
  const response = await axios.get(`/auth/seller/verify-email`, {
    params: { token },
  });
  return response.data;
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: () => verifyEmail(token),
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
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-3">
      <h1 className="text-lg text-green-500">Email Verified Successfully</h1>
      <p className="text-gray-800">
        Thank you for verifying your email! You can now log in.
      </p>
      <Link href="/seller/login" className="text-blue-500">
        Go to Login
      </Link>
    </div>
  );
}
