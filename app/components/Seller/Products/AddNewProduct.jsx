"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaPlus, FaTrash } from "react-icons/fa";
import { addNewProductSchema } from "@/validationSchemas/validation";
import { SizesFieldArray } from "../form_components/SizesFieldArray";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import useCategoriesQuery from "@/app/hooks/useCategoriesQuery";
import Loader from "../../Loader/Loader";
import { useState } from "react";
import dynamic from "next/dynamic";
const NewProductFormFields = dynamic(() => import("./NewProductFormFields"), {
  loading: () => <Loader />,
});

const inputErrorStyles =
  "py-2 border border-red-600 px-2 outline-red-600 rounded-lg w-full";
const inputStyles =
  "py-2 border border-gray-700 px-2 rounded-lg cursor-pointer outline-purple-900 w-full";
const errorStyles = "text-sm text-red-600 inline-block w-full text-center";

const generateSKU = () =>
  `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

const AddNewProduct = ({ sellerId }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addNewProductSchema),
  });

  const {
    fields: variantFields,
    append,
    remove,
  } = useFieldArray({ control, name: "variants" });

  const { data, isLoading: isCategoriesLoading, error } = useCategoriesQuery();

  const availableSubCategories = data?.categories.find(
    (cat) => cat.name === selectedCategory
  );
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/auth/seller/products", {
        seller: sellerId,
        ...formData,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Product added successfully");
      queryClient.invalidateQueries(["sellerProducts", sellerId]);
      reset();
      router.push(`/seller/dashboard/${sellerId}/${data.product._id}`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      reset();
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  const dataFields = [
    "title",
    "shortDescription",
    "productDetails",
    "price",
    "discount",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="w-full h-full flex flex-col gap-3 py-3"
    >
      {dataFields.map((field) => (
        <NewProductFormFields
          key={field}
          register={register}
          registerAs={field}
          errors={errors}
        />
      ))}

      <div className="flex flex-col gap-2">
        <label className="font-bold">Category</label>
        {isCategoriesLoading ? (
          <Loader />
        ) : (
          <select
            {...register("category")}
            className={errors.category ? inputErrorStyles : inputStyles}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
          >
            <option value="">Select a category</option>
            {data?.categories?.length > 0 ? (
              data.categories.map((category) => {
                if (category.name === "Clothing") {
                  return null;
                }
                return (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                );
              })
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
        )}
        {errors.category && (
          <span className={errorStyles}>{errors.category.message}</span>
        )}
        {error && (
          <span className={errorStyles}>Failed to load categories.</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Sub Category</label>
        {isCategoriesLoading ? (
          <Loader />
        ) : (
          <select
            {...register("subCategory")}
            className={errors.category ? inputErrorStyles : inputStyles}
          >
            <option value="">Select a sub-category</option>
            {availableSubCategories?.subCategories?.length > 0 ? (
              availableSubCategories?.subCategories?.map((subcategory) => {
                return (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                );
              })
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
        )}
        {errors.category && (
          <span className={errorStyles}>{errors.category.message}</span>
        )}
        {error && (
          <span className={errorStyles}>Failed to load sub categories.</span>
        )}
      </div>

      <div className="flex justify-between items-center py-2 border-b">
        <span className="font-bold text-xl">Variants</span>
        <button
          type="button"
          onClick={() =>
            append({
              color: "",
              sizes: [""],
              images: [],
              stock: 50,
              sku: generateSKU(),
            })
          }
          className="flex items-center justify-center cursor-pointer gap-2 px-5 py-2 rounded-full bg-orange-600 hover:bg-orange-500 text-white"
        >
          <FaPlus /> Add Variant
        </button>
      </div>

      {variantFields.map((variant, index) => (
        <div
          key={variant.id}
          className="flex flex-col gap-2 border p-3 rounded-md"
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Variant {index + 1}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Color</label>
            <input
              {...register(`variants.${index}.color`)}
              className={
                errors.variants?.[index]?.color ? inputErrorStyles : inputStyles
              }
              placeholder="Enter color"
            />
            {errors.variants?.[index]?.color && (
              <span className={errorStyles}>
                {errors.variants[index].color.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Sizes</label>
            <SizesFieldArray
              control={control}
              register={register}
              index={index}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Stock</label>
            <input
              {...register(`variants.${index}.stock`)}
              type="number"
              className={
                errors.variants?.[index]?.stock ? inputErrorStyles : inputStyles
              }
              placeholder="Enter stock quantity"
            />
            {errors.variants?.[index]?.stock && (
              <span className={errorStyles}>
                {errors.variants[index].stock.message}
              </span>
            )}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className={
          isPending
            ? "bg-purple-500 text-white py-2 rounded-lg mt-4"
            : "bg-purple-900 text-white py-2 rounded-lg mt-4"
        }
      >
        {isPending ? "Adding..." : "Add Product"}
      </button>
      <ToastContainer position="top-center" autoClose={2000} />
    </form>
  );
};

export default AddNewProduct;
