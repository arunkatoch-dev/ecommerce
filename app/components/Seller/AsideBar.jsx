"use client";
import Link from "next/link";
import { useSellerData } from "./SellerDataProvider";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const styles =
  "w-full inline-flex  text-lg border-b py-5 px-4 font-bold cursor-pointer hover:text-black/60";

const AsideBar = () => {
  const { data, isLoading, error, toggleSideBar } = useSellerData();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/auth/seller/logout`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "something went wrong");
      } else {
        toast.success(data.message || "Logout successfull");
        router.push("/seller/login");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  const logoutSeller = () => {
    mutate();
  };

  if (error) return <Error message={error.message} />;
  return (
    <>
      <aside
        className={
          toggleSideBar
            ? `absolute bg-white w-[60%] z-20 md:static  md:w-[20%] h-full overflow-y-auto border-r flex-col justify-between`
            : "hidden"
        }
      >
        <div className="w-full flex flex-col">
          <Link href="/seller/dashboard/profile" className={styles}>
            Profile
          </Link>
          {data?.seller?._id && (
            <Link
              href={`/seller/dashboard/${data?.seller?._id}`}
              className={styles}
            >
              Products
            </Link>
          )}

          <Link href="/seller/dashboard/catagories" className={styles}>
            Catagories
          </Link>
          <Link href="/seller/dashboard/orders" className={styles}>
            Orders
          </Link>
          <Link href="/seller/dashboard/editProfile" className={styles}>
            Edit Profile
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          data.seller._id && (
            <div className="flex w-full items-center justify-center p-7">
              <button
                disabled={isPending}
                onClick={logoutSeller}
                className={`w-full rounded-full py-2 text-lg ${
                  isPending
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                {isPending ? "Logging out..." : " Log out"}
              </button>
            </div>
          )
        )}
      </aside>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default AsideBar;
