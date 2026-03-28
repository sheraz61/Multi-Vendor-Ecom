import React from 'react'
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/style.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import { useState } from 'react';
function WishList({ setOpenWishlist }) {
    const cartData = [
        {
            name: "Iphone 14 pro max 256 gb",
            description: "testing",
            price: 4000
        },
        {
            name: "Iphone 14 pro max 256 gb",
            description: "testing",
            price: 4000
        },
        {
            name: "Iphone 14 pro max 256 gb",
            description: "testing",
            price: 4000
        },
       
    ]
    return (
        <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10'>
            <div className="fixed top-0 right-0 min-h-full w-[25%] bg-whifixed top-0 right-0 h-full w-[60%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
                <div>
                    <div className='flex w-full justify-end pt-5 pr-5'>
                        <RxCross1
                            size={25}
                            className="cursor-pointer"
                            onClick={() => setOpenWishlist(false)}
                        />
                    </div>
                    {/* Item length */}
                    <div className={`${styles.normalFlex} p-4`}>
                        <AiOutlineHeart size={25} />
                        <h5 className="pl-2 text-[20px] font-[500]">
                            3 items
                        </h5>
                    </div>
                    {/* cart Single Items */}
                    <br />
                    <div className="w-full border-t">
                        {cartData &&
                            cartData.map((i, index) => (
                                <CartSingle
                                    key={index}
                                    data={i}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const CartSingle = ({ data }) => {
    const [value, setValue] = useState(1);
    const totalPrice = data.price * value;
    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                  <RxCross1 className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
        />
                <img
                    src=''
                    alt=""
                    className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
                />
                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    <h4 className="font-[400] text-[15px] text-[#00000082]">
                        ${data.price} * {value}
                    </h4>
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
                        US${totalPrice}
                    </h4>
                </div>
               <div>
          <BsCartPlus size={20} className="cursor-pointer" tile="Add to cart"
           
          />
        </div>
            </div>
        </div>
    )
}
export default WishList