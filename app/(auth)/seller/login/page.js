import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const SellerLogin = dynamic(() => import("@/app/components/auth/SellerLogin"), {
  loading: () => <Loader />,
});

const sellerlogin = () => {
  return <SellerLogin />;
};

export default sellerlogin;
