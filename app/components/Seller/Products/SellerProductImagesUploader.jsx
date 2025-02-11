"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Loader from "../../Loader/Loader";
import Error from "../../Error/Error";

const fetchSellerProduct = async (productId) => {
  const response = await axios.get(
    `/auth/seller/products/product/?productId=${productId}`
  );
  return response.data;
};

const updateProduct = async (data) => {
  const response = await axios.patch(
    `/auth/seller/products/product/?productId=${data._id}`,
    data
  );
  return response.data;
};

const deleteImage = async (publicId) => {
  const response = await axios.delete(`/cloudinary/?public_id=${publicId}`);
  return response.data;
};

const SellerProductImagesUploader = ({ productId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sellerProduct", productId],
    queryFn: () => fetchSellerProduct(productId),
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success(data.message || "Product updated");
        queryClient.invalidateQueries(["sellerProduct", productId]);
        reset();
        router.push(`/seller/dashboard/${data.product.seller}`);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      reset();
    },
  });

  const { handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      variants: [],
    },
  });

  useEffect(() => {
    if (data) {
      const { variants } = data.product;
      setValue("variants", variants || []);
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    mutation.mutate({ ...formData, _id: productId });
  };

  const handleDeleteImage = async (publicId, variantIndex, imgIndex) => {
    try {
      await deleteImage(publicId);
      handleSubmit(onSubmit);
      const newImages = data.product.variants[variantIndex].images.filter(
        (_, i) => i !== imgIndex
      );
      setValue(`variants.${variantIndex}.images`, newImages);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-6 bg-white ">
      <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold">Variants</label>
          {data?.product?.variants.map((variant, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 border p-4 rounded-lg"
            >
              <p className="py-3 font-bold border-b">Variant {index + 1}</p>
              <div className="flex flex-col gap-2">
                <label className="font-bold">Images</label>
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
                  options={{ folder: "products" }}
                  onSuccess={(result) => {
                    const newImage = {
                      url: result.info.secure_url,
                      public_id: result.info.public_id,
                    };
                    const newImages = [...variant.images, newImage];
                    setValue(`variants.${index}.images`, newImages);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={open}
                      className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Upload Images
                    </button>
                  )}
                </CldUploadWidget>
                <div className="flex flex-wrap gap-2 mt-2">
                  {variant?.images?.map((image, imgIndex) => (
                    <div key={imgIndex} className="relative">
                      <img
                        src={image.url}
                        alt="Uploaded"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteImage(image.public_id, index, imgIndex)
                        }
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={mutation?.isPending}
          className="py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-purple-700"
        >
          {mutation.isPending ? "saving..." : "Save Changes"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={800} />
    </form>
  );
};

export default SellerProductImagesUploader;
