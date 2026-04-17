import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/style";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/shop";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.shop);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [deliveredOrder, setDeliveredOrder] = useState(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
   
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw money request is successful!");
          dispatch(loadSeller());
          setOpen(false)
        });
    }
  };

 const availableBalance = seller?.availableBalance.toFixed(2);
 return (
  <div className="w-full h-[90vh] p-6">
    <div className="w-full bg-white h-full rounded-xl border border-gray-100 shadow-sm flex items-center justify-center flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Available Balance</p>
      <p className="text-4xl font-bold text-gray-900">${availableBalance}</p>
      <button
        onClick={() => availableBalance < 50 ? error() : setOpen(true)}
        className="h-10 px-8 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Withdraw Funds
      </button>
    </div>

    {open && (
      <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#00000050]">
        <div className={`w-[95%] 800px:w-[480px] bg-white rounded-xl shadow-xl ${paymentMethod ? "max-h-[85vh] overflow-y-auto" : ""}`}>

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">
              {paymentMethod ? "Add Withdraw Method" : "Withdraw Funds"}
            </h3>
            <button
              onClick={() => { setOpen(false); setPaymentMethod(false); }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <RxCross1 size={14} className="text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            {paymentMethod ? (
              // Bank Details Form
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: "Bank Name", key: "bankName", type: "text", placeholder: "Enter your bank name" },
                  { label: "Bank Country", key: "bankCountry", type: "text", placeholder: "Enter your bank country" },
                  { label: "Swift Code", key: "bankSwiftCode", type: "text", placeholder: "Enter swift code" },
                  { label: "Account Number", key: "bankAccountNumber", type: "number", placeholder: "Enter account number" },
                  { label: "Account Holder Name", key: "bankHolderName", type: "text", placeholder: "Enter holder name" },
                  { label: "Bank Address", key: "bankAddress", type: "text", placeholder: "Enter bank address" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      {label} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={bankInfo[key]}
                      onChange={(e) => setBankInfo({ ...bankInfo, [key]: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <button type="submit"
                  className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors mt-2">
                  Save Method
                </button>
              </form>
            ) : (
              <>
                {seller?.withdrawMethod ? (
                  <div className="flex flex-col gap-5">
                    {/* Saved Method */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-800">{seller.withdrawMethod.bankName}</p>
                        <p className="text-sm text-gray-500">
                          {"•".repeat(seller.withdrawMethod.bankAccountNumber.length - 3)}
                          {seller.withdrawMethod.bankAccountNumber.slice(-3)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteHandler()}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition"
                      >
                        <AiOutlineDelete size={17} className="text-gray-400 hover:text-red-400" />
                      </button>
                    </div>

                    {/* Withdraw Amount */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Withdraw Amount</p>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full h-10 pl-7 pr-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={withdrawHandler}
                          className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
                        >
                          Withdraw
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Minimum withdrawal: $50 · Available: ${availableBalance}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No withdraw method added yet</p>
                    <button
                      onClick={() => setPaymentMethod(true)}
                      className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add Bank Account
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default WithdrawMoney;