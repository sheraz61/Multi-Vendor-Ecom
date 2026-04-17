import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/style";
import { useEffect } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config,
       
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymnentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
    .post(`${server}/order/create-order`, order, config)
    .then((res) => {
      setOpen(false);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);
 
  return (
  <div className="w-full 800px:w-[95%] bg-white border border-gray-100 rounded-xl shadow-sm p-6">
    <h2 className="text-base font-semibold text-gray-800 mb-5">Payment Method</h2>

    <div className="flex flex-col gap-3">

      {/* Option 1 — Card */}
      <div className={`border rounded-xl overflow-hidden transition-colors ${select === 1 ? "border-teal-500" : "border-gray-200"}`}>
        <button type="button" onClick={() => setSelect(1)}
          className="w-full flex items-center gap-3 px-4 py-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
            ${select === 1 ? "border-teal-600" : "border-gray-300"}`}>
            {select === 1 && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
          </div>
          <span className="text-sm font-medium text-gray-800">Debit / Credit Card</span>
        </button>

        {select === 1 && (
          <div className="px-5 pb-5 border-t border-gray-100">
            <form className="flex flex-col gap-4 pt-4" onSubmit={paymentHandler}>
              <div className="flex flex-col 800px:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-gray-700">Name on Card</label>
                  <input readOnly value={user && user.name}
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                  <div className="w-full h-10 px-3 border border-gray-200 rounded-lg flex items-center">
                    <CardExpiryElement options={{ style: { base: { fontSize: "15px", color: "#444" } } }} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col 800px:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-gray-700">Card Number</label>
                  <div className="w-full h-10 px-3 border border-gray-200 rounded-lg flex items-center">
                    <CardNumberElement options={{ style: { base: { fontSize: "15px", color: "#444" } } }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <div className="w-full h-10 px-3 border border-gray-200 rounded-lg flex items-center">
                    <CardCvcElement options={{ style: { base: { fontSize: "15px", color: "#444" } } }} />
                  </div>
                </div>
              </div>
              <button type="submit"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Pay Now
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Option 2 — PayPal */}
      <div className={`border rounded-xl overflow-hidden transition-colors ${select === 2 ? "border-teal-500" : "border-gray-200"}`}>
        <button type="button" onClick={() => setSelect(2)}
          className="w-full flex items-center gap-3 px-4 py-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
            ${select === 2 ? "border-teal-600" : "border-gray-300"}`}>
            {select === 2 && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
          </div>
          <span className="text-sm font-medium text-gray-800">PayPal</span>
        </button>

        {select === 2 && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <button onClick={() => setOpen(true)}
              className="w-full h-10 bg-[#0070ba] hover:bg-[#005ea6] text-white text-sm font-medium rounded-lg transition-colors">
              Pay with PayPal
            </button>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-[#00000050] h-screen flex items-center justify-center z-[99999]">
                <div className="w-[95%] 800px:w-[420px] bg-white rounded-xl shadow-xl p-6 relative">
                  <button onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                    <RxCross1 size={14} className="text-gray-600" />
                  </button>
                  <h3 className="text-base font-semibold text-gray-800 mb-5">Pay with PayPal</h3>
                  <PayPalScriptProvider options={{ "client-id": 'AXVtoea4yZkCbizG_Z2Pk0O6aezG5fkp4euk_kItN_1uGI39CVkbkmPiwphWqPpqLNaBiUH8VgCsuwbR' }}>
                    <PayPalButtons style={{ layout: "vertical" }} onApprove={onApprove} createOrder={createOrder} />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Option 3 — Cash on Delivery */}
      <div className={`border rounded-xl overflow-hidden transition-colors ${select === 3 ? "border-teal-500" : "border-gray-200"}`}>
        <button type="button" onClick={() => setSelect(3)}
          className="w-full flex items-center gap-3 px-4 py-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
            ${select === 3 ? "border-teal-600" : "border-gray-300"}`}>
            {select === 3 && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
          </div>
          <span className="text-sm font-medium text-gray-800">Cash on Delivery</span>
        </button>

        {select === 3 && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <form onSubmit={cashOnDeliveryHandler}>
              <button type="submit"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Confirm Order
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  </div>
);
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
 return (
  <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-6 sticky top-6">
    <h2 className="text-base font-semibold text-gray-800 mb-5">Order Summary</h2>
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="text-sm font-medium text-gray-800">${orderData?.subTotalPrice}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Shipping</span>
        <span className="text-sm font-medium text-gray-800">${shipping}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Discount</span>
        <span className="text-sm font-medium text-teal-600">
          {orderData?.discountPrice ? `− $${orderData.discountPrice}` : "—"}
        </span>
      </div>
      <div className="flex justify-between pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-800">Total</span>
        <span className="text-base font-bold text-gray-900">${orderData?.totalPrice}</span>
      </div>
    </div>
  </div>
);
};

export default Payment;