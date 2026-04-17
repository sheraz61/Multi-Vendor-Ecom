import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/style.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
function WishList({ setOpenWishlist }) {
    const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = {...data, qty:1};
    dispatch(addTocart(newData));
    setOpenWishlist(false);
}
   return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000050] z-10">
      <div className="fixed top-0 right-0 h-full w-[85%] 800px:w-[26%] bg-white flex flex-col shadow-xl">

        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setOpenWishlist(false)}
            >
              <RxCross1 size={15} className="text-gray-600" />
            </button>
            <AiOutlineHeart size={40} className="text-gray-300" />
            <p className="text-sm text-gray-400">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AiOutlineHeart size={22} className="text-gray-700" />
                <span className="text-base font-semibold text-gray-800">
                  Wishlist <span className="text-gray-400 font-normal text-sm">({wishlist.length} items)</span>
                </span>
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => setOpenWishlist(false)}
              >
                <RxCross1 size={15} className="text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {wishlist && wishlist.map((i, index) => (
                <CartSingle
                  key={index}
                  data={i}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  addToCartHandler={addToCartHandler}
                />
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

const CartSingle = ({ data,removeFromWishlistHandler,addToCartHandler }) => {
    const [value, setValue] = useState(1);
    const totalPrice = data.discountPrice * value;
   return (
    <div className="flex items-center gap-3 px-4 py-3">

      {/* Product Image */}
      <img
        src={`${data?.images[0]?.url}`}
        alt=""
        className="w-16 h-16 rounded-lg object-cover bg-gray-50 shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{data.name}</p>
        <p className="text-sm font-semibold text-teal-600 mt-0.5">USD ${totalPrice}</p>
      </div>

      {/* Add to Cart */}
      <button
        onClick={() => addToCartHandler(data)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-50 hover:bg-teal-100 transition shrink-0"
        title="Add to cart"
      >
        <BsCartPlus size={16} className="text-teal-600" />
      </button>

      {/* Remove */}
      <button
        onClick={() => removeFromWishlistHandler(data)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition shrink-0"
      >
        <RxCross1 size={13} className="text-gray-400" />
      </button>

    </div>
  );
}
export default WishList