"use client";
import { FiMenu } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";
import UseCartQuery from "@/app/hooks/useCartQuery";
import dynamic from "next/dynamic";
const Searchbar = dynamic(() => import("./Searchbar"), {
  loading: () => <Loader />,
});
import { useState } from "react";

const Navbar = () => {
  const { userLoading, userError, userData, cartLoading, cartError, cartData } =
    UseCartQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isLoading: isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/auth/user/logout`);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success(data.message || "Logout successful");
        queryClient.invalidateQueries(["userData"]);
        router.push("/login");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  const logoutUser = () => {
    mutate();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <FiMenu
            className="text-lg hover:text-black/80 cursor-pointer lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          {/* Logo */}
          <Link
            href="/"
            className="text-lg lg:text-3xl text-black uppercase font-bold"
          >
            Shop.co
          </Link>
        </div>
        {/* Navigation Links */}
        <ul
          className={`lg:flex gap-4 text-base items-center ${
            isMenuOpen
              ? "flex flex-col absolute z-10 top-16 left-0 w-full bg-white shadow-md p-4 lg:static lg:bg-transparent lg:shadow-none"
              : "hidden"
          }`}
        >
          <Link href="/topselling">
            <li className="cursor-pointer text-black hover:text-black/70 text-base">
              Shop
            </li>
          </Link>
          <Link href="/newarrivals">
            <li className="cursor-pointer text-black hover:text-black/70 text-base">
              On Sale
            </li>
          </Link>
          <Link href="/newarrivals">
            <li className="cursor-pointer text-black hover:text-black/70 text-base">
              New Arrivals
            </li>
          </Link>
          <Link href="/topselling">
            <li className="cursor-pointer text-black hover:text-black/70 text-base">
              Brands
            </li>
          </Link>
        </ul>
        <div className="hidden lg:block">
          <Searchbar />
        </div>
        {/* Cart and User Dropdown */}
        <div className="flex items-center gap-4">
          <CiSearch
            className="w-6 h-6 text-black hover:text-black/70 cursor-pointer lg:hidden"
            onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
          />
          <Link href="/cart">
            <div className="relative">
              <IoCartOutline className="w-6 h-6 text-black hover:text-black/70 cursor-pointer" />
              {cartData?.cart?.items?.length > 0 && (
                <div className="absolute top-0 -right-1 w-2 h-2 rounded-full bg-red-500"></div>
              )}
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <FaRegUserCircle className="w-6 h-6 text-black/80 hover:text-black/70 cursor-pointer" />
            </DropdownMenuTrigger>
            {cartLoading || userLoading ? (
              <DropdownMenuContent>
                <Loader />
              </DropdownMenuContent>
            ) : userData?.user?._id ? (
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={`/profile/${userData?.user?._id}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/orders/${userData?.user?._id}`}>Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/userwhishlist/${userData?.user?._id}`}>
                    WishList
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    className={`${
                      isPending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isPending}
                    onClick={logoutUser}
                  >
                    {isPending ? "Logging out..." : "Logout"}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/signup">Sign Up</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
      {/* Mobile Searchbar */}
      <div className={isSearchBarOpen ? `p-4 flex` : `hidden`}>
        <Searchbar />
      </div>
      <ToastContainer position="top-center" autoClose={1000} />
    </nav>
  );
};

export default Navbar;
