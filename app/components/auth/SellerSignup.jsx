"use client";

import AuthSignupForm from "./AuthSignupForm";
import { signupUserSchema } from "@/validationSchemas/validation";

const sellerFields = [
  { name: "UserName", apiKey: "name", type: "text", placeholder: "User Name" },
  { name: "Email", apiKey: "email", type: "email", placeholder: "Email" },
  { name: "Password", apiKey: "password", type: "password", placeholder: "Password" },
  { name: "ConfirmPassword", apiKey: "confirmPassword", type: "password", placeholder: "Confirm Password" },
];

const SellerSignup = () => (
  <AuthSignupForm
    validationSchema={signupUserSchema}
    endpoint="/auth/seller/signup"
    redirectPath={null}
    fields={sellerFields}
    mainButtonText="Sign Up as Seller"
    altButtonText="Seller Login"
    altButtonHref="/seller/login"
    switchText="SignUp as Customer"
    switchHref="/signup"
  />
);

export default SellerSignup;
