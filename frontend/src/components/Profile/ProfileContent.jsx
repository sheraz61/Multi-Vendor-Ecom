import React, { useState } from 'react'
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/style";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { Country, State } from 'country-state-city'
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_Url } from '../../server';
import { getAllOrdersOfUser } from '../../redux/actions/order';

function ProfileContent({ active }) {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);


  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };


  return (
    <div className='w-full'>
      {/* profile  */}
      {
        active === 1 && (
      <>
  {/* Avatar */}
  <div className="flex justify-center w-full pt-6">
    <div className="relative">
      <img
        src={user?.avatar?.url}
        className="w-[120px] h-[120px] rounded-full object-cover ring-4 ring-teal-50 shadow-sm"
        alt=""
      />
      <div className="w-8 h-8 bg-white border border-gray-200 shadow rounded-full flex items-center justify-center cursor-pointer absolute bottom-1 right-1">
        <input type="file" id="image" className="hidden" onChange={handleImage} />
        <label htmlFor="image" className="cursor-pointer flex items-center justify-center">
          <AiOutlineCamera size={15} className="text-gray-600" />
        </label>
      </div>
    </div>
  </div>

  {/* Form */}
  <div className="w-full px-5 mt-8">
    <form onSubmit={handleSubmit} aria-required={true}>
      <div className="flex flex-col gap-5">

        {/* Row 1 */}
        <div className="w-full 800px:flex gap-5">
          <div className="w-full 800px:w-[50%] flex flex-col gap-1.5 mb-4 800px:mb-0">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%] flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="text"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="w-full 800px:flex gap-5">
          <div className="w-full 800px:w-[50%] flex flex-col gap-1.5 mb-4 800px:mb-0">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="number"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%] flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="h-10 px-8 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Update Profile
          </button>
        </div>

      </div>
    </form>
  </div>
</>
        )
      }
      {/* order  */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {/* Refund  */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {/* Track order  */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}
      {/* change password  */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}
      {/* User Address  */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  )
}

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id))
  }, [])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
}

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
   <div className="w-full max-w-lg mx-auto px-5 py-8">

  <div className="text-center mb-8">
    <h1 className="text-xl font-semibold text-gray-800">Change Password</h1>
    <p className="text-sm text-gray-400 mt-1">Update your account password</p>
  </div>

  <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col gap-5">

    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Old Password</label>
      <input
        type="password"
        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        required
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Enter old password"
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">New Password</label>
      <input
        type="password"
        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        type="password"
        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
      />
    </div>

    <button
      type="submit"
      className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors mt-2"
    >
      Update Password
    </button>

  </form>
</div>
  )
}
const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full px-5">
     {/* Add Address Modal */}
{open && (
  <div className="fixed w-full h-screen bg-[#00000050] top-0 left-0 flex items-center justify-center z-50">
    <div className="w-[95%] 800px:w-[40%] max-h-[85vh] bg-white rounded-xl shadow-xl overflow-y-auto">

      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Add New Address</h2>
        <button
          onClick={() => setOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <RxCross1 size={14} className="text-gray-600" />
        </button>
      </div>

      <form aria-required onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Choose your country</option>
            {Country && Country.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Choose your city</option>
            {State && State.getStatesOfCountry(country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Address 1</label>
          <input type="address" required value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Address 2</label>
          <input type="address" required value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Zip Code</label>
          <input type="number" required value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Address Type</label>
          <select value={addressType} onChange={(e) => setAddressType(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Choose address type</option>
            {addressTypeData && addressTypeData.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <button type="submit"
          className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors mt-2">
          Save Address
        </button>

      </form>
    </div>
  </div>
)}

{/* Address List Header */}
<div className="flex items-center justify-between mb-5">
  <h1 className="text-lg font-semibold text-gray-800">My Addresses</h1>
  <button
    onClick={() => setOpen(true)}
    className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
  >
    + Add New
  </button>
</div>

{/* Address Cards */}
{user && user?.addresses?.map((item, index) => (
  <div key={index}
    className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-3 mb-3 shadow-sm">
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
        {item?.addressType}
      </span>
    </div>
    <p className="text-sm text-gray-600 flex-1 min-w-0 truncate">
      {item?.address1} {item?.address2}
    </p>
    <p className="text-sm text-gray-500">{user?.phoneNumber}</p>
    <button
      onClick={() => handleDelete(item)}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition"
    >
      <AiOutlineDelete size={18} className="text-gray-400 hover:text-red-400" />
    </button>
  </div>
))}

{user && user?.addresses?.length === 0 && (
  <div className="text-center py-12">
    <p className="text-sm text-gray-400">No saved addresses yet</p>
  </div>
)}
    </div>
  );
};

export default ProfileContent