"use client";
import AuthLoginForm from "./AuthLoginForm";
import { loginUserSchema } from "@/validationSchemas/validation";

const UserLogin = () => (
  <AuthLoginForm
    validationSchema={loginUserSchema}
    endpoint="/auth/user/login"
    redirectPath="/"
    mainButtonText="Login"
    altButtonText="Sign Up"
    altButtonHref="/signup"
    switchText="Login as Seller"
    switchHref="/seller/login"
    forgotPasswordHref="/password-reset"
    forgotPasswordText="forgot password"
  />
);

export default UserLogin;
