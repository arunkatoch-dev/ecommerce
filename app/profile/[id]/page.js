import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";
import React from "react";

const UserProfile = dynamic(
  () => import("../../components/Profile/UserProfile"),
  {
    loading: () => <Loader />,
  }
);
const Navbar = dynamic(() => import("../../components/Navbar/Navbar"), {
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("../../components/Homepage/Footer"), {
  loading: () => <Loader />,
});

const userProfilePage = async ({ params }) => {
  const _id = (await params).id;
  return (
    <>
      <Navbar />
      <UserProfile _id={_id} />
      <Footer />
    </>
  );
};

export default userProfilePage;
