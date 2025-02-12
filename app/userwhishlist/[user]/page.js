import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const Whishlist = dynamic(() => import("@/app/components/Whishlist/Wishlist"), {
  loading: () => <Loader />,
});
const Navbar = dynamic(() => import("@/app/components/Navbar/Navbar"), {
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("@/app/components/Homepage/Footer"), {
  loading: () => <Loader />,
});

const WhishListPage = async ({ params }) => {
  const user = (await params).user;
  return (
    <>
      <Navbar />
      <Whishlist user={user} />
      <Footer />
    </>
  );
};

export default WhishListPage;
