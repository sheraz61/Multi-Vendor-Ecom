import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { loadingSeller, isSeller } = useSelector((state) => state.shop);
  if (loadingSeller === true) {
return(
  <Loader/>
)
  }else{
    if (!isSeller) {
      return <Navigate to={`/shop-login`} replace />;
    }
    return children;
  }
};

export default SellerProtectedRoute;