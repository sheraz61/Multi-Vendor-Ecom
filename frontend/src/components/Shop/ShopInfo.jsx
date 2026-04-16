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
      totalReviewsLength > 0 ? averageRating.toFixed(2) : "0";

  return (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <div className="w-full flex flex-col gap-1">

        {/* Avatar + Name + Description */}
        <div className="flex flex-col items-center text-center px-5 pt-6 pb-4 border-b border-gray-100">
          <img
            src={`${data.avatar?.url}`}
            alt=""
            className="w-[100px] h-[100px] rounded-full object-cover ring-4 ring-teal-50 shadow-sm"
          />
          <h3 className="mt-3 text-lg font-semibold text-gray-900">{data.name}</h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed break-words">
            {data.description}
          </p>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col divide-y divide-gray-50 px-5 py-2">

          <div className="py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
            <p className="text-sm text-gray-700 break-words">{data.address}</p>
          </div>

          <div className="py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Phone Number</p>
            <p className="text-sm text-gray-700 break-all">{data.phoneNumber}</p>
          </div>

          <div className="py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total Products</p>
            <p className="text-sm text-gray-700">{products && products.length}</p>
          </div>

          <div className="py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Shop Rating</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-800">{ratingDisplay}</span>
              <span className="text-xs text-gray-400">/ 5</span>
              <span className="ml-1 text-yellow-400 text-sm">★</span>
            </div>
          </div>

          <div className="py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Joined On</p>
            <p className="text-sm text-gray-700">{data?.createdAt?.slice(0, 10)}</p>
          </div>

        </div>

        {/* Owner Buttons */}
        {isOwner && (
          <div className="flex flex-col gap-2 px-5 pt-2 pb-5">
            <Link to="/settings">
              <button className="w-full h-10 rounded-lg border border-teal-600 text-teal-600 text-sm font-medium hover:bg-teal-50 transition-colors">
                Edit Shop
              </button>
            </Link>
            <button
              onClick={logoutHandler}
              className="w-full h-10 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
        )}

      </div>
    )}
  </>
);
};

export default ShopInfo;