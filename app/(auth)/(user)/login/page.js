import Loader from "@/app/components/Loader/Loader";
import dynamic from "next/dynamic";

const UserLogin = dynamic(() => import("@/app/components/auth/UserLogin"), {
  loading: () => <Loader />,
});

const Login = () => {
  return <UserLogin />;
};

export default Login;
