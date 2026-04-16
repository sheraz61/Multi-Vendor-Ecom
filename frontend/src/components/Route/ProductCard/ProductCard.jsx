import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import Ratings from "../../Products/Ratings";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
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
  };
 return (
  <div className="w-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 relative group">
    
    {/* Product Image */}
    <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
      <div className="w-full h-[180px] bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={`${data.images && data.images[0]?.url}`}
          alt=""
          className="h-full w-full object-contain p-3 hover:scale-105 transition-transform duration-300"
        />
      </div>
    </Link>

    {/* Side Action Icons */}
    <div className="absolute top-3 right-3 flex flex-col gap-2">
      {click ? (
        <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border border-gray-100">
          <AiFillHeart
            size={16}
            className="cursor-pointer text-red-500"
            onClick={() => removeFromWishlistHandler(data)}
            title="Remove from wishlist"
          />
        </button>
      ) : (
        <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border border-gray-100">
          <AiOutlineHeart
            size={16}
            className="cursor-pointer text-gray-400"
            onClick={() => addToWishlistHandler(data)}
            title="Add to wishlist"
          />
        </button>
      )}
      <button
        className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border border-gray-100"
        onClick={() => setOpen(!open)}
        title="Quick view"
      >
        <AiOutlineEye size={16} className="text-gray-400" />
      </button>
      <button
        className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border border-gray-100"
        onClick={() => addToCartHandler(data._id)}
        title="Add to cart"
      >
        <AiOutlineShoppingCart size={16} className="text-gray-400" />
      </button>
    </div>

    {/* Card Body */}
    <div className="p-4 flex flex-col gap-1">
      <Link to={`/shop/preview/${data?.shop._id}`}>
        <p className="text-xs text-teal-600 font-medium hover:underline">{data.shop.name}</p>
      </Link>

      <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
        <h4 className="text-sm font-medium text-gray-800 leading-snug">
          {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
        </h4>

        <div className="mt-1">
          <Ratings rating={data?.ratings} />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-gray-900">
              {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}$
            </span>
            {data.originalPrice ? (
              <span className="text-xs text-gray-400 line-through">{data.originalPrice}$</span>
            ) : null}
          </div>
          <span className="text-xs text-teal-600 font-medium">{data?.sold_out} sold</span>
        </div>
      </Link>
    </div>

    {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
  </div>
);
}

export default ProductCard
