import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import UserProfile from "../../components/Profile/UserProfile";
import Footer from "../../components/Homepage/Footer";

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
