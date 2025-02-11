

const ProductDescription = ({ productDetails }) => {
  return (
    <section className="w-full py-2 flex flex-col border-b">
      <span className="text-3xl font-bold uppercase pb-12">
        Product Details
      </span>
      <p>{productDetails}</p>
    </section>
  );
};

export default ProductDescription;
