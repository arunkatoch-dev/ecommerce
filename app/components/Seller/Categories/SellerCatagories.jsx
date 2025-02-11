"use client";
import React, { useState } from "react";
import useCategoriesQuery from "@/app/hooks/useCategoriesQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Loader from "../../Loader/Loader";
import Error from "../../Error/Error";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";

const SellerCategories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategoriesQuery();

  const handleAddSubCategory = () => {
    if (newSubCategory) {
      setSubCategories([...subCategories, newSubCategory]);
      setNewSubCategory("");
    }
  };

  const handleAddOrUpdateCategory = async () => {
    const url = isEditMode
      ? `/category?currentCategoryId=${currentCategoryId}`
      : "/category";
    const method = isEditMode ? "patch" : "post";

    try {
      const response = await axios[method](url, {
        name: newCategory,
        subCategories,
        parentCategory,
      });
      if (response.data.success === true) {
        toast.success(
          response.data.message ||
            `Category ${isEditMode ? "updated" : "added"}`
        );
        queryClient.invalidateQueries(["productCategories"]);
        closeModal();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} category:`,
        error
      );
    }
  };

  const handleEditCategory = (category) => {
    setIsEditMode(true);
    setCurrentCategoryId(category._id);
    setNewCategory(category.name);
    setSubCategories(category.subCategories || []);
    setParentCategory(category.parentCategory || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewCategory("");
    setSubCategories([]);
    setParentCategory(null);
    setCurrentCategoryId(null);
  };

  // Organize categories into parent-child structure
  const categorizedData = {};

  if (categoriesData?.categories) {
    categoriesData.categories.forEach((category) => {
      const parentKey = category.parentCategory || "root";
      if (!categorizedData[parentKey]) {
        categorizedData[parentKey] = [];
      }
      categorizedData[parentKey].push(category);
    });
  }

  return (
    <section className="w-full flex flex-col p-5 min-h-[80vh]">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add New Category</Button>
      </div>

      {isCategoriesLoading && <Loader />}
      {categoriesError && <Error message={categoriesError.message} />}

      {/* Display Parent Categories and Their Child Categories */}
      {Object.entries(categorizedData).map(([parentId, categories]) => (
        <div key={parentId} className="mb-6">
          {/* Parent Category */}
          {parentId !== "root" && (
            <h2 className="text-lg font-bold mb-2">
              {categoriesData?.categories.find((c) => c._id === parentId)?.name}
            </h2>
          )}

          {/* Child Categories */}
          {categories.map((category) => (
            <Card key={category._id} className="mb-4">
              <CardContent>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <Button onClick={() => handleEditCategory(category)}>
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {category.subCategories?.map((subCat) => (
                    <span
                      key={subCat}
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      {subCat}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      {/* Dialog (Modal) for Adding/Editing Category */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mb-4"
            />

            {/* Parent Category Selector */}
            <select
              className="w-full p-2 border rounded mb-4"
              value={parentCategory || ""}
              onChange={(e) => setParentCategory(e.target.value || null)}
            >
              <option value="">No Parent (Top Level)</option>
              {categoriesData?.categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Add Subcategory */}
            <div className="flex items-center mb-4">
              <Input
                type="text"
                placeholder="Subcategory Name"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                className="mr-2"
              />
              <Button onClick={handleAddSubCategory}>Add Subcategory</Button>
            </div>

            {/* Display Added Subcategories */}
            <div className="flex flex-wrap gap-2">
              {subCategories.map((subCat, index) => (
                <span
                  key={`${subCat}-${index}`}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  {subCat}
                </span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeModal} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateCategory}>
              {isEditMode ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-center" autoClose={1500} />
    </section>
  );
};

export default SellerCategories;
