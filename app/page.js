import HomepageBrowseByBanner from "./components/Banners/HomepageBrowseByBanner";
import BrandsBoard from "./components/BrandsShowCase/BrandsBoard";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Homepage/Footer";
import HappyCustomers from "./components/Homepage/HappyCustomers";
import SignupPopup from "./components/Homepage/SignupPopup";
import Navbar from "./components/Navbar/Navbar";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import TopSelling from "./components/topselling/TopSelling";

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
