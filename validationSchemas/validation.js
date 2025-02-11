import * as yup from "yup";

export const signpUserSchema = yup.object({
  Email: yup
    .string()
    .email("Please type a valid email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      "Please type a valid email"
    )
    .required("Email is required *"),
  Password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at max 12 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
      `Password must include (8-12) chars including 1 special char, 1 lowercase, 1 Uppercase and numbers*`
    )
    .required("Password is required *"),
  ConfirmPassword: yup
    .string()
    .oneOf([yup.ref("Password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

//   ****************************************************************************************************

export const loginUserSchema = yup.object({
  Email: yup
    .string()
    .email("Please type a valid email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      "Please type a valid email"
    )
    .required("Email is required *"),
  Password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at max 12 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
      `Password must include (8-12) chars including 1 special char, 1 lowercase, 1 Uppercase and numbers*`
    )
    .required("Password is required *"),
});

//   ****************************************************************************************************

export const sellerProfileSchema = yup.object({
  name: yup
    .string()
    .min(3, "user name must be greater than 3")
    .max(30, "user name must be lesser than 30")
    .matches(
      /^[A-Za-z]+( [A-Za-z]+)*$/,
      "Username can only contain alphabets with single spaces between words"
    )
    .required("Username is required"),
  email: yup
    .string()
    .email("Please type a valid email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      "Please type a valid email"
    )
    .required("Email is required *"),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Please enter valid phone number")
    .required("Phone is required"),
  street: yup.string().required("Required"),
  city: yup.string().required("Required"),
  state: yup.string().required("Required"),
  zipCode: yup
    .string()
    .required("Required")
    .min(6, "zip code must be of 6 chars")
    .max(6, "zip code must be of 6 chars"),
  country: yup.string().required("Required"),
  businessName: yup
    .string()
    .required("Required")
    .min(3, "enter valid business name")
    .max(30, "enter valid business name"),
  businessLicenseNumber: yup
    .string()
    .required("Required")
    .max(20, "enter valid licence number"),
  accountHolderName: yup
    .string()
    .min(3, "account holder's name must be greater than 3")
    .max(30, "account holder's name must be lesser than 30")
    .matches(/^[A-Za-z]+( [A-Za-z]+)*$/, "enter valid account holder's name")
    .required("account holder name is required"),
  accountNumber: yup
    .string()
    .required("required")
    .min(5, "enter valid account number")
    .max(20, "enter valid account number"),
  bankName: yup
    .string()
    .required("required")
    .min(2, "enter valid bank name")
    .max(60, "enter valid bank name"),
  ifscCode: yup
    .string()
    .required("required")
    .min(5, "enter valid ifsc code")
    .max(20, "enter valid ifsc code"),
});

//   ****************************************************************************************************

const variantSchema = yup.object().shape({
  color: yup.string().required("Color is required"),
  sizes: yup
    .array()
    .of(yup.string().required("Size is required"))
    .min(1, "At least one size is required"),
  // images: yup
  //   .array()
  //   .of(yup.mixed().required("Image is required"))
  //   .min(1, "At least one image is required")
  //   .max(5, "You can upload up to 5 images"),
  stock: yup
    .number()
    .required("Stock is required")
    .positive("Stock must be a positive number"),
});

export const addNewProductSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  shortDescription: yup.string().required("Short description is required"),
  productDetails: yup.string().required("Product details are required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  discount: yup
    .number()
    .required("Discount is required")
    .min(0, "Discount cannot be negative"),
  category: yup.string().required("Category is required"),
  variants: yup
    .array()
    .of(variantSchema)
    .min(1, "At least one variant is required"),
});

// *******************************************************************************

export const addressSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal Code is required"),
});
