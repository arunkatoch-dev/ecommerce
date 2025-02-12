import dynamic from "next/dynamic";
import Loader from "../components/Loader/Loader";

const Cart = dynamic(() => import("../components/cartComponents/Cart"), {
  loading: () => <Loader />,
});
const CartPage = () => {
  return <Cart />;
};

export default CartPage;
