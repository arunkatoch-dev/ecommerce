"use client";
const inputErrorStyles =
  "py-2 border border-red-600 px-2 outline-red-600 rounded-lg w-full";
const inputStyles =
  "py-2 border px-2 rounded-lg cursor-pointer outline-purple-900 w-full";
const errorStyles = "text-sm text-red-600 inline-block w-full text-center";
const inputContainer = "flex flex-col w-full gap-2";
const NewProductFormFields = ({ register, registerAs, errors }) => {
  let placeholder = "Type here...";
  let type = "text";
  switch (registerAs) {
    case "title":
      type: "text";
      placeholder = "Enter your Product title";
      break;
    case "shortDescription":
      type: "text";
      placeholder = "Enter short description for your Product";
      break;
    case "productDetails":
      type: "text";
      placeholder = "Enter your Product details";
      break;
    case "price":
      type: "number";
      placeholder = "Set Price for your product";
      break;
    case "discount":
      type: "number";
      placeholder = "Set discount e.g. 10";
      break;

    default:
      placeholder;
      break;
  }

  return (
    <div className={inputContainer}>
      <div className="flex flex-col gap-2">
        <label htmlFor={registerAs} className="text-lg capitalize font-bold">
          {registerAs}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          {...register(registerAs)}
          className={errors.title ? inputErrorStyles : inputStyles}
        />
      </div>
      {errors[registerAs] && (
        <span className={errorStyles}>{errors[registerAs].message}</span>
      )}
    </div>
  );
};

export default NewProductFormFields;
