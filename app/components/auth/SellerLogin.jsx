"use client";
import AuthLoginForm from "./AuthLoginForm";
import { loginUserSchema } from "@/validationSchemas/validation";

const SellerLogin = () => (
  <AuthLoginForm
    validationSchema={loginUserSchema}
    endpoint="/auth/seller/login"
    redirectPath="/seller/dashboard"
    mainButtonText="Login as Seller"
    altButtonText="Register as Seller"
    altButtonHref="/seller/signup"
    switchText="Login as Customer"
    switchHref="/login"
    forgotPasswordHref="/seller/password-reset"
    forgotPasswordText="forgot password"
  />
);

export default SellerLogin;
