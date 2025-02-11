"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const resetPassword = async ({ token, newPassword }) => {
  const response = await axios.post(`/auth/user/password-reset/reset`, {
    token,
    newPassword,
  });
  return response.data;
};

export default function ResetUserPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      // Show loading toast when mutation starts
      return toast.loading("saving new password...");
    },
    onSuccess: (data, variables, context) => {
      if (!data.success) {
        toast.dismiss(context); // Dismiss the loading toast
        toast.error(data.message || "Something went wrong");
      } else {
        toast.dismiss(context); // Dismiss the loading toast
        toast.success(data.message || "Password reset successfully");
        router.push("/login");
      }
    },
    onError: (error, variables, context) => {
      toast.dismiss(context); // Dismiss the loading toast
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
      return;
    }

  
  }, [token]);

 

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    mutate({ token, newPassword });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-3">
      <h1 className="text-lg text-green-500">Reset Your Password</h1>
      <div className="flex flex-col gap-2 w-full max-w-md">
        <input
          type="password"
          required
          name="newPassword"
          value={newPassword}
          placeholder="Enter new password"
          autoComplete="off"
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 w-full px-2 py-1"
        />
        <input
          type="password"
          required
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm new password"
          autoComplete="off"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 w-full px-2 py-1"
        />
        <button
          disabled={isPending}
          type="submit"
          className="px-4 py-1 text-lg bg-purple-800 text-white hover:bg-purple-700"
          onClick={handleResetPassword}
        >
          {isPending ? "Resetting Password..." : "Reset Password"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
