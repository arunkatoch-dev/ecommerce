import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const UserSignup = dynamic(() => import("@/app/components/auth/UserSignup"), {
  loading: () => <Loader />,
});

const Signup = () => {
  return <UserSignup />;
};

export default Signup;
