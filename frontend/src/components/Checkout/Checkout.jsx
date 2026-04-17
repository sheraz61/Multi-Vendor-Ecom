import React, { useState } from "react";
import styles from "../../styles/style";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  
//sending order data to the payment function
  const paymentSubmit = () => {
   if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
      toast.error("Please choose your delivery address!")
   } else{
    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    }

    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
   }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  

  return (
  <div className="w-full flex flex-col items-center py-8 bg-gray-50 min-h-screen">
    <div className="w-[90%] 1000px:w-[70%] flex flex-col 800px:flex-row gap-6">
      <div className="w-full 800px:w-[65%]">
        <ShippingInfo user={user} country={country} setCountry={setCountry}
          city={city} setCity={setCity} userInfo={userInfo} setUserInfo={setUserInfo}
          address1={address1} setAddress1={setAddress1} address2={address2}
          setAddress2={setAddress2} zipCode={zipCode} setZipCode={setZipCode} />
      </div>
      <div className="w-full 800px:w-[35%]">
        <CartData handleSubmit={handleSubmit} totalPrice={totalPrice}
          shipping={shipping} subTotalPrice={subTotalPrice} couponCode={couponCode}
          setCouponCode={setCouponCode} discountPercentenge={discountPercentenge} />
      </div>
    </div>
    <button
      onClick={paymentSubmit}
      className="mt-8 h-11 px-10 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
    >
      Continue to Payment →
    </button>
  </div>
);
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
 return (
  <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-6">
    <h2 className="text-base font-semibold text-gray-800 mb-5">Shipping Information</h2>

    <form className="flex flex-col gap-4">
      <div className="flex flex-col 800px:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" value={user && user.name} required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none" readOnly />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" value={user && user.email} required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none" readOnly />
        </div>
      </div>

      <div className="flex flex-col 800px:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <input type="number" value={user && user.phoneNumber} required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none" readOnly />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Zip Code</label>
          <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
        </div>
      </div>

      <div className="flex flex-col 800px:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="">Choose your country</option>
            {Country && Country.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="">Choose your city</option>
            {State && State.getStatesOfCountry(country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col 800px:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Address 1</label>
          <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Address 2</label>
          <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
        </div>
      </div>
    </form>

    {/* Saved Addresses */}
    <button
      onClick={() => setUserInfo(!userInfo)}
      className="mt-5 text-sm text-teal-600 font-medium hover:underline"
    >
      {userInfo ? "Hide" : "Use"} saved address
    </button>
    {userInfo && (
      <div className="mt-3 flex flex-col gap-2">
        {user && user.addresses.map((item, index) => (
          <label key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="checkbox" className="accent-teal-600"
              value={item.addressType}
              onClick={() =>
                setAddress1(item.address1) || setAddress2(item.address2) ||
                setZipCode(item.zipCode) || setCountry(item.country) || setCity(item.city)
              }
            />
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{item.addressType}</span>
            <span className="text-sm text-gray-600 truncate">{item.address1}</span>
          </label>
        ))}
      </div>
    )}
  </div>
);
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
 return (
  <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-6 sticky top-6">
    <h2 className="text-base font-semibold text-gray-800 mb-5">Order Summary</h2>

    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="text-sm font-medium text-gray-800">${subTotalPrice}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Shipping</span>
        <span className="text-sm font-medium text-gray-800">${shipping.toFixed(2)}</span>
      </div>
      {discountPercentenge && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Discount</span>
          <span className="text-sm font-medium text-teal-600">− ${discountPercentenge}</span>
        </div>
      )}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-800">Total</span>
        <span className="text-base font-bold text-gray-900">${totalPrice}</span>
      </div>
    </div>

    {/* Coupon */}
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
          className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <button type="submit"
          className="h-10 px-4 border border-teal-600 text-teal-600 text-sm font-medium rounded-lg hover:bg-teal-50 transition shrink-0">
          Apply
        </button>
      </div>
    </form>
  </div>
);
};

export default Checkout;