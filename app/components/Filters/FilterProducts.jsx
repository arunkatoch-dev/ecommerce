"use client";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { BiSortAlt2 } from "react-icons/bi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UseCategoriesQuery from "@/app/hooks/useCategoriesQuery";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

const colors = [
  "red",
  "green",
  "blue",
  "white",
  "black",
  "yellow",
  "orange",
  "purple",
  "pink",
  "gray",
];
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const FilterProducts = ({ sortValues, setSortValues }) => {
  const [display, setDisplay] = useState({
    filterAccordion: true,
    filterPrice: 100,
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    data,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = UseCategoriesQuery();

  const [filters, setFilters] = useState({
    sortField: "title",
    sortOrder: "asc",
    color: null,
    minPrice: null,
    maxPrice: null,
    size: null,
    category: null,
    subCategory: null,
  });

  const changeSortValues = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      minPrice: display.filterPrice,
    }));
  };

  const applyFilters = () => {
    setSortValues({ ...sortValues, ...filters, minPrice: display.filterPrice });
    setIsMobileFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      sortField: "title",
      sortOrder: "asc",
      color: null,
      minPrice: null,
      maxPrice: null,
      size: null,
      category: null,
      subCategory: null,
    });
    setSortValues({
      ...sortValues,
      sortField: "title",
      sortOrder: "asc",
      color: null,
      minPrice: null,
      maxPrice: null,
      size: null,
      category: null,
      subCategory: null,
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-end mb-4">
        <Button variant="outline" onClick={() => setIsMobileFilterOpen(true)}>
          <BiSortAlt2 className="mr-2 text-lg" />
          Filters
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden  w-[20%] h-full border rounded-2xl p-6 lg:flex flex-col gap-6 sticky top-20">
        <FiltersContent
          display={display}
          setDisplay={setDisplay}
          changeSortValues={changeSortValues}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          isCategoriesLoading={isCategoriesLoading}
          isCategoriesError={isCategoriesError}
          data={data}
          colors={colors}
          sizes={sizes}
        />
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <FiltersContent
            display={display}
            setDisplay={setDisplay}
            changeSortValues={changeSortValues}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            isCategoriesLoading={isCategoriesLoading}
            isCategoriesError={isCategoriesError}
            data={data}
            colors={colors}
            sizes={sizes}
          />
          <DialogFooter className="flex justify-between">
            <Button variant="secondary" onClick={clearFilters}>
              Clear
            </Button>
            <Button onClick={applyFilters}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const FiltersContent = ({
  display,
  setDisplay,
  changeSortValues,
  applyFilters,
  clearFilters,
  isCategoriesLoading,
  isCategoriesError,
  data,
  colors,
  sizes,
}) => (
  <div className="flex flex-col gap-6">
    {/* Categories */}
    <Accordion type="single" collapsible>
      <AccordionItem value="categories">
        <AccordionTrigger className="font-bold">Categories</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {isCategoriesLoading ? (
            <Loader />
          ) : isCategoriesError ? (
            <Error message={data?.error?.message || "An error occurred"} />
          ) : (
            data?.categories?.map((category) => {
              if (category.name === "Clothing") return null;
              return (
                <Accordion
                  key={category._id || category.name}
                  type="single"
                  collapsible
                >
                  <AccordionItem
                    value={`category-${category._id || category.name}`}
                  >
                    <AccordionTrigger
                      className="hover:underline"
                      onClick={() =>
                        changeSortValues("category", category.name)
                      }
                    >
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      {category.subCategories?.map((subCategory) => (
                        <p
                          key={subCategory}
                          className="py-1 cursor-pointer hover:underline"
                          onClick={() =>
                            changeSortValues("subCategory", subCategory)
                          }
                        >
                          {subCategory}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    {/* Price Filter */}
    <Accordion type="single" collapsible>
      <AccordionItem value="price">
        <AccordionTrigger className="font-bold">Price</AccordionTrigger>
        <AccordionContent>
          <Slider
            defaultValue={[100]}
            max={20000}
            step={100}
            onValueChange={(value) =>
              setDisplay((prev) => ({ ...prev, filterPrice: value[0] }))
            }
          />
          <span className="text-gray-600 text-sm">
            Up to ₹{display.filterPrice}
          </span>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    {/* Colors Filter */}
    <Accordion type="single" collapsible>
      <AccordionItem value="colors">
        <AccordionTrigger className="font-bold">Colors</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-full border cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => changeSortValues("color", color)}
            ></div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    {/* Sizes Filter */}
    <Accordion type="single" collapsible>
      <AccordionItem value="sizes">
        <AccordionTrigger className="font-bold">Sizes</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="px-4 py-1 bg-gray-100 text-gray-800 border rounded-full cursor-pointer hover:bg-gray-200"
              onClick={() => changeSortValues("size", size)}
            >
              {size}
            </span>
          ))}
        </AccordionContent>
      </AccordionItem>
      <div className="flex gap-3 w-full flex-col py-3">
        <Button onClick={applyFilters} className="w-full">
          Apply
        </Button>
        <Button variant="secondary" className="w-full" onClick={clearFilters}>
          Reset
        </Button>
      </div>
    </Accordion>
  </div>
);

export default FilterProducts;
