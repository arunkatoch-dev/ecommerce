"use client";
import { useController } from "react-hook-form";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export const ImageUpload = ({ control, name, errors }) => {
  const [resource, setResource] = useState();
  const { field } = useController({ control, name });

  return (
    <div className="border-dashed border-2 p-4 rounded-md">
      <CldUploadWidget
        signatureEndpoint="/sign-cloudinary-params"
        onSuccess={(result, { widget }) => {
          setResource(result?.info); // { public_id, secure_url, etc }
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
