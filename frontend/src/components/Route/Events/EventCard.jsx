
import React from "react";
import styles from "../../../styles/style.js";
import CountDown from "./CountDown.jsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
//   const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div
       className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2`}
    >
      <div className="w-full lg:-w[50%] m-auto">
        <img src="https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1" alt="" />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>Iphone 14 pro max</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio maiores error eligendi ipsam nesciunt laboriosam praesentium natus porro, non autem ab, omnis laudantium nisi necessitatibus dolorum ipsum debitis aut. Atque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil recusandae ad, commodi ipsam voluptates rem? Ratione possimus nobis eaque perspiciatis. Iste quae temporibus quas nulla pariatur nobis fugiat magnam inventore.</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              1089 $
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              999 $
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            120 sold
          </span>
        </div>
        <CountDown />
        <br />
        {/* <div className="flex items-center">
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
        
          <div className={`${styles.button} text-[#fff] ml-5`}>Add to cart</div>
        </div> */}
      </div>
    </div>
  );
};

export default EventCard;
