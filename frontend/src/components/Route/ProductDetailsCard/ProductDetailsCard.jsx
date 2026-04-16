import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../styles/style";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import axios from "axios";
import { server } from "../../../server";
const ProductDetailsCard = ({ setOpen, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const navigate= useNavigate()
  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id
      const sellerId = data.shop._id
      await axios.post(`${server}/conversation/create-new-conversation`, { groupTitle, userId, sellerId }).then((res)=>{
        navigate(`/conversation/${res.data.conversation._id}`)
      }).catch((error)=>{
        toast.error(error.response.data.message)
      })
    }else{
      toast.error('please login to start chat')
    }
  }
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }
  const incrementCount = () => {
    setCount(count + 1)
  }
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };
 
  
  return (
  <div className="bg-[#fff]">
    {data ? (
      <div className="fixed w-full h-screen top-0 left-0 bg-[#00000050] z-40 flex items-center justify-center">
        <div className="w-[90%] 800px:w-[60%] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl relative">

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <RxCross1 size={16} className="text-gray-600" />
          </button>

          <div className="flex flex-col 800px:flex-row">

            {/* Left — Image + Shop */}
            <div className="w-full 800px:w-[50%] p-6 border-b 800px:border-b-0 800px:border-r border-gray-100 flex flex-col gap-4">
              <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={`${data.images && data?.images[0]?.url}`}
                  alt=""
                  className="w-full h-full object-contain p-3"
                />
              </div>

              {/* Shop Info */}
              <Link to={`/shop/preview/${data.shop._id}`} className="flex items-center gap-3">
                <img
                  src={data.shop.avatar?.url}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-teal-600">{data.shop.name}</p>
                  <p className="text-xs text-gray-400">{data?.ratings?.toFixed(2) || 0}/5 Ratings</p>
                </div>
              </Link>

              <button
                onClick={handleMessageSubmit}
                className="w-full h-10 flex items-center justify-center gap-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <AiOutlineMessage size={16} /> Send Message
              </button>

              <p className="text-xs text-gray-400">
                <span className="text-red-400 font-medium">{data?.sold_out}</span> sold out
              </p>
            </div>

            {/* Right — Details */}
            <div className="w-full 800px:w-[50%] p-6 flex flex-col gap-4">
              <h1 className="text-xl font-semibold text-gray-900 leading-snug">{data.name}</h1>
              <p className="text-sm text-gray-500 leading-relaxed">{data.description}</p>

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-gray-900">{data.discountPrice}$</span>
                {data.originalPrice && (
                  <span className="text-base text-gray-400 line-through">{data.originalPrice}$</span>
                )}
              </div>

              {/* Qty + Wishlist */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={decrementCount}
                    className="w-9 h-9 border border-gray-200 rounded-l-lg flex items-center justify-center text-lg hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-11 h-9 border-t border-b border-gray-200 flex items-center justify-center text-sm font-medium">
                    {count}
                  </span>
                  <button
                    onClick={incrementCount}
                    className="w-9 h-9 border border-gray-200 rounded-r-lg flex items-center justify-center text-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                {click ? (
                  <AiFillHeart
                    size={24}
                    className="cursor-pointer text-red-500"
                    onClick={() => removeFromWishlistHandler(data)}
                    title="Remove from wishlist"
                  />
                ) : (
                  <AiOutlineHeart
                    size={24}
                    className="cursor-pointer text-gray-400 hover:text-red-400 transition"
                    onClick={() => addToWishlistHandler(data)}
                    title="Add to wishlist"
                  />
                )}
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCartHandler(data._id)}
                className="w-full h-11 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
              >
                <AiOutlineShoppingCart size={18} /> Add to cart
              </button>
            </div>

          </div>
        </div>
      </div>
    ) : null}
  </div>
);
}

export default ProductDetailsCard
