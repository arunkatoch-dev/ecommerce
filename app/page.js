import dynamic from "next/dynamic";
import Loader from "./components/Loader/Loader";

const HomepageBrowseByBanner = dynamic(
  () => import("./components/Banners/HomepageBrowseByBanner"),
  {
    loading: () => <Loader />,
  }
);
const BrandsBoard = dynamic(
  () => import("./components/BrandsShowCase/BrandsBoard"),
  {
    loading: () => <Loader />,
  }
);
const Hero = dynamic(() => import("./components/Hero/Hero"), {
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("./components/Homepage/Footer"), {
  loading: () => <Loader />,
});
const HappyCustomers = dynamic(
  () => import("./components/Homepage/HappyCustomers"),
  {
    loading: () => <Loader />,
  }
);
const SignupPopup = dynamic(() => import("./components/Homepage/SignupPopup"), {
  loading: () => <Loader />,
});
const Navbar = dynamic(() => import("./components/Navbar/Navbar"), {
  loading: () => <Loader />,
});
const NewArrivals = dynamic(
  () => import("./components/NewArrivals/NewArrivals"),
  {
    loading: () => <Loader />,
  }
);
const TopSelling = dynamic(() => import("./components/topselling/TopSelling"), {
  loading: () => <Loader />,
});

export default function Home() {
  return (
    <main>
      <SignupPopup />
      <Navbar />
      <Hero />
      <BrandsBoard />
      <NewArrivals />
      <TopSelling />
      <HomepageBrowseByBanner />
      <HappyCustomers />
      <Footer />
    </main>
  );
}
