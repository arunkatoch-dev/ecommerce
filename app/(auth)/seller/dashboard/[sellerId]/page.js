import SellerProducts from "@/app/components/Seller/Products/SellerProducts";

const SellerProductsPage = async ({ params }) => {
  const sellerId = (await params).sellerId;
  return <SellerProducts sellerId={sellerId} />;
};

export default SellerProductsPage;
