import SellerProductDetails from "@/app/components/Seller/Products/SellerProductImagesUploader";

const sellerproductdetails = async ({ params }) => {
  const productId = (await params).product;
  return <SellerProductDetails productId={productId} />;
};

export default sellerproductdetails;
