"use client";
import AuthSignupForm from "./AuthSignupForm";
import { signupUserSchema } from "@/validationSchemas/validation";

const userFields = [
  { name: "Email", apiKey: "email", type: "email", placeholder: "Email" },
  { name: "Password", apiKey: "password", type: "password", placeholder: "Password" },
  { name: "ConfirmPassword", apiKey: "confirmPassword", type: "password", placeholder: "Confirm Password" },
];

const UserSignup = () => (
  <AuthSignupForm
    validationSchema={signupUserSchema}
    endpoint="/auth/user/signup"
    redirectPath="/login"
    fields={userFields}
    mainButtonText="Sign Up"
    altButtonText="Login"
    altButtonHref="/login"
    switchText="Signup as Seller"
    switchHref="/seller/signup"
  />
);

export default UserSignup;
