import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/style";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector, } from "react-redux";
import {useNavigate} from 'react-router-dom';
import { getAllProductsShop } from "../../redux/actions/product";
import { loadSeller } from "../../redux/actions/shop";
const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const {products} = useSelector((state) => state.products);
  const [isLoading,setIsLoading] = useState(false);
  const { seller } = useSelector((state) => state.shop);
  const { id } = useParams();
  const dispatch = useDispatch();
 const navigate = useNavigate();
 useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
     setData(res.data.shop);
     setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  }, []);


   const logoutHandler = async () => {
   await axios.get(`${server}/shop/logout`,{
      withCredentials: true,
    });
    dispatch(loadSeller());
    window.location.reload(true);
    // navigate("/shop-login");
  };

    const totalReviewsLength =
      products &&
      products.reduce((acc, product) => acc + product.reviews.length, 0);

    const totalRatings = products && products.reduce((acc,product) => acc + product.reviews.reduce((sum,review) => sum + review.rating, 0),0);

    const averageRating =
      totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;
    const ratingDisplay =
      totalReviewsLength > 0 ? averageRating.toFixed(1) : "0.0";

  return (
    <>
   {
    isLoading  ? (
      <Loader />
    ) : (
      <div>
      <div className="w-full min-w-0 py-5">
        <div className="flex w-full items-center justify-center">
          <img
            src={`${data.avatar?.url}`}
            alt=""
            className="h-[150px] w-[150px] rounded-full object-cover"
          />
        </div>
        <h3 className="px-2 py-2 text-center text-[20px]">{data.name}</h3>
        <p className="break-words px-[10px] text-[16px] text-[#000000a6]">
          {data.description}
        </p>
      </div>
      <div className="min-w-0 p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="break-words text-[#000000a6]">{data.address}</h4>
      </div>
      <div className="min-w-0 p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="break-all text-[#000000a6]">{data.phoneNumber}</h4>
      </div>
      <div className="min-w-0 p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products && products.length}</h4>
      </div>
      <div className="min-w-0 p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">{ratingDisplay}/5</h4>
      </div>
      <div className="min-w-0 p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
           <Link to="/settings">
           <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
            <span className="text-white">Edit Shop</span>
          </div>
           </Link>
          <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
          onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </div>
    )
   }
   </>
  );
};

export default ShopInfo;