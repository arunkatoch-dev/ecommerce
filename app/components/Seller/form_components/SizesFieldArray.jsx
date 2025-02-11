"use client";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const SizesFieldArray = ({
  control,
  register,
  index,
  watch,
  setValue,
}) => {
  const { append } = useFieldArray({
    control,
    name: `variants.${index}.sizes`,
  });

  const selectedSizes = watch(`variants.${index}.sizes`) || [];

  useEffect(() => {
    if (!selectedSizes.length) {
      setValue(`variants.${index}.sizes`, sizes);
    }
  }, [selectedSizes, setValue, index]);

  return (
    <div>
      {sizes.map((size) => (
        <div key={size} className="w-full flex gap-2 items-center">
          <input
            {...register(`variants.${index}.sizes`)}
            type="checkbox"
            className="text-lg"
            value={size}
            checked={selectedSizes.includes(size)}
            onChange={(e) => {
              const updatedSizes = e.target.checked
                ? [...selectedSizes, size] // Add size if checked
                : selectedSizes.filter((s) => s !== size); // Remove size if unchecked
              setValue(`variants.${index}.sizes`, updatedSizes);
              append("");
            }}
            id={size}
          />
          <label htmlFor={size} className="text-lg">
            {size}
          </label>
        </div>
      ))}
    </div>
  );
};
