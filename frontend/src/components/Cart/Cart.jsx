import React from 'react'
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/style.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';
import { addTocart, removeFromCart } from "../../redux/actions/cart";
function Cart({ setOpenCart }) {
    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const removeFromCartHandler = (data) => {
        dispatch(removeFromCart(data));
    };

    const totalPrice = cart.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
    );

    const quantityChangeHandler = (data) => {
        dispatch(addTocart(data));
    };
    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000050] z-10">
            <div className="fixed top-0 right-0 h-full w-[85%] 800px:w-[26%] bg-white flex flex-col shadow-xl">

                {cart && cart.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <button
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                            onClick={() => setOpenCart(false)}
                        >
                            <RxCross1 size={15} className="text-gray-600" />
                        </button>
                        <IoBagHandleOutline size={40} className="text-gray-300" />
                        <p className="text-sm text-gray-400">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <IoBagHandleOutline size={22} className="text-gray-700" />
                                <span className="text-base font-semibold text-gray-800">
                                    Cart <span className="text-gray-400 font-normal text-sm">({cart.length} items)</span>
                                </span>
                            </div>
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() => setOpenCart(false)}
                            >
                                <RxCross1 size={15} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                            {cart && cart.map((i, index) => (
                                <CartSingle
                                    key={index}
                                    data={i}
                                    quantityChangeHandler={quantityChangeHandler}
                                    removeFromCartHandler={removeFromCartHandler}
                                />
                            ))}
                        </div>

                        {/* Checkout */}
                        <div className="px-5 py-4 border-t border-gray-100">
                            <Link to="/checkout">
                                <button
                                    className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
                                    onClick={() => setOpenCart(false)}
                                >
                                    Checkout — USD ${totalPrice}
                                </button>
                            </Link>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
    const [value, setValue] = useState(data.qty);
    const totalPrice = data.discountPrice * value;
    const increment = (data) => {
        if (data.stock < value) {
            toast.error("Product stock limited!");
        } else {
            setValue(value + 1);
            const updateCartData = { ...data, qty: value + 1 };
            quantityChangeHandler(updateCartData);
        }
    };

    const decrement = (data) => {
        setValue(value === 1 ? 1 : value - 1);
        const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
        quantityChangeHandler(updateCartData);
    };
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
                <p className="text-xs text-gray-400 mt-0.5">${data.discountPrice} each</p>
                <p className="text-sm font-semibold text-teal-600 mt-0.5">USD ${totalPrice}</p>
            </div>

            {/* Qty Controls */}
            <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                    onClick={() => increment(data)}
                    className="w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center transition"
                >
                    <HiPlus size={14} color="#fff" />
                </button>
                <span className="text-sm font-medium text-gray-700">{value}</span>
                <button
                    onClick={() => decrement(data)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                    <HiOutlineMinus size={14} className="text-gray-500" />
                </button>
            </div>

            {/* Remove */}
            <button
                onClick={() => removeFromCartHandler(data)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition shrink-0"
            >
                <RxCross1 size={13} className="text-gray-400" />
            </button>

        </div>
    );
}
export default Cart