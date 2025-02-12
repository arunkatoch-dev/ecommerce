import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";


const SellerProducts = dynamic(() => import("@/app/components/Seller/Products/SellerProducts"), {
  loading: () => <Loader />,
});
const SellerProductsPage = async ({ params }) => {
  const sellerId = (await params).sellerId;
  return <SellerProducts sellerId={sellerId} />;
};

export default SellerProductsPage;
