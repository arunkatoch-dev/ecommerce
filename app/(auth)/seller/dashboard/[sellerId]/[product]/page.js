import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const SellerProductDetails = dynamic(
  () => import("@/app/components/Seller/Products/SellerProductImagesUploader"),
  {
    loading: () => <Loader />,
  }
);

const SellerproductdetailsPage = async ({ params }) => {
  const productId = (await params).product;
  return <SellerProductDetails productId={productId} />;
};

export default SellerproductdetailsPage;
