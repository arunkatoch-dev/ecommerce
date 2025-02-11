import SingleProduct from "@/app/components/Products/SingleProduct";

const productdetails = async ({ params }) => {
  const _id = (await params).id;

  return <SingleProduct _id={_id} />;
};

export default productdetails;
