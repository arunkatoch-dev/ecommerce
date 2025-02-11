"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import Link from "next/link";

const fetchRelatedProducts = async (searchTerm) => {
  if (!searchTerm) return []; // Avoid unnecessary API calls
  const response = await axios.get(`/products/search?query=${searchTerm}`);
  return response.data.products;
};

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef(null); // Ref for search container

  // Query with automatic fetching when searchTerm changes
  const {
    data: relatedProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["relatedProducts", searchTerm],
    queryFn: () => fetchRelatedProducts(searchTerm),
    enabled: !!searchTerm, // Only fetch when searchTerm is not empty
  });

  // Debounced function to update searchTerm
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setIsDropdownVisible(!!value); // Show dropdown when input has value
    }, 500), // 500ms debounce time
    []
  );

  const handleInputChange = (e) => {
    setSearchVal(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Click outside to hide dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchRef}
      className="relative w-full lg:w-[577px] h-12 bg-[#F0F0F0] rounded-3xl p-3 flex gap-3 items-center"
    >
      <CiSearch className="w-3 h-3  md:w-6 md:h-6 text-gray-500" />
      <input
        type="text"
        name="search"
        placeholder="Search for products..."
        className="bg-transparent outline-none w-full text-sm md:text-base"
        autoComplete="off"
        value={searchVal}
        onChange={handleInputChange}
      />
      {isDropdownVisible && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-lg rounded-lg z-10 max-h-64 overflow-y-auto">
          {relatedProducts.length === 0 ? (
            <div className="flex p-5">
              <span className="text-red">No Products found...</span>
            </div>
          ) : (
            <ul>
              {relatedProducts.map((product) => (
                <Link href={`/topselling/${product._id}`} key={product._id}>
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    {product.title}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
