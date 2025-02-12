import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const SellerSignup = dynamic(
  () => import("@/app/components/auth/SellerSignup"),
  {
    loading: () => <Loader />,
  }
);

const sellersignup = () => {
  return <SellerSignup />;
};

export default sellersignup;
