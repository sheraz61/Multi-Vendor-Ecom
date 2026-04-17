import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[75vh] w-full flex items-center bg-cover bg-center`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className={`relative w-[90%] md:w-[60%] mx-auto text-white`}>
        <h1
          className={`text-3xl md:text-6xl font-semibold leading-tight`}
        >
          Everything You Need, <br /> All in One Place
        </h1>
        <p className="mt-4 text-sm md:text-lg text-gray-200 max-w-xl">
         Shop from thousands of products across multiple categories. Discover great deals, trusted sellers, and a seamless shopping experience all in one platform.
        </p>
        <Link to="/products" className="inline-block">
            <div className={`mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-700 transition rounded-lg text-white font-medium`}>
                 <span className="">
                    Shop Now
                 </span>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;