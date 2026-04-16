
import React from "react";
import styles from "../../../styles/style.js";
import CountDown from "./CountDown.jsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  }
  return (
     <div className={`w-full bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col lg:flex-row ${active ? "" : "mb-12"}`}>
      
      {/* Image */}
      <div className="relative w-full lg:w-[340px] shrink-0">
        <img src={`${data?.images[0]?.url}`} alt="" className="w-full h-full object-cover min-h-[220px]" />
        <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-medium px-3 py-1 rounded-md uppercase tracking-wide">
          Live Event
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        <h2 className="font-serif text-xl text-gray-900 leading-snug">{data?.name}</h2>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{data?.description}</p>

        {/* Pricing */}
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-semibold text-gray-900">{data?.discountPrice}$</span>
          <span className="text-sm text-gray-400 line-through">{data?.originalPrice}$</span>
          <span className="ml-auto text-sm text-teal-600 font-medium">{data?.sold_out} sold</span>
        </div>

        {/* Countdown */}
        <CountDown data={data} />

        {/* Actions */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <Link to={`/product/${data?._id}?isEvent=true`}>
            <button className="h-10 px-5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              See Details
            </button>
          </Link>
          <button
            onClick={() => addToCartHandler(data)}
            className="h-10 px-5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
