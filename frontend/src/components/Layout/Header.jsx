import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from "../../styles/style.js";
import DropDown from './DropDown.jsx'
import Navbar from './Navbar.jsx'
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx"
import { categoriesData, productData } from "../../static/data";
import { backend_Url } from '../../server.js';
import Cart from '../Cart/Cart.jsx'
import WishList from '../WishList/WishList.jsx'
const Header = ({ activeHeading }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { allProducts } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const { isSeller } = useSelector((state) => state.shop);
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);

  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  return (
  <>
    {/* ── Desktop Top Bar ── */}
    <div className={`${styles.section}`}>
      <div className="hidden 800px:flex items-center justify-between h-[50px] my-3 gap-6">
        <Link to="/">
          <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" className='h-[120px] w-[120px]'  alt="" />
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-[480px] relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-[38px] px-4 pr-10 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-teal-500"
          />
          <AiOutlineSearch size={18} className="absolute right-3 top-2.5 text-gray-400" />
          {searchData && searchData.length > 0 && (
            <div className="absolute top-[42px] left-0 right-0 bg-white border border-gray-100 rounded-lg z-50 overflow-hidden shadow-sm">
              {searchData.map((i, index) => (
                <Link to={`/product/${i._id}`} key={index}>
                  <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <img src={`${backend_Url}${i.images[0]}`} alt="" className="w-9 h-9 rounded-md object-cover" />
                    <span className="text-sm text-gray-800">{i.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to={isSeller ? "/dashboard" : "/shop-create"}>
          <button className="h-[36px] px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg flex items-center gap-1">
            {isSeller ? "Go Dashboard" : "Become Seller"} <IoIosArrowForward size={14} />
          </button>
        </Link>
      </div>
    </div>

    {/* ── Desktop Nav Bar ── */}
    <div className={`${active ? "shadow-sm fixed top-0 left-0 z-10" : ""} hidden 800px:flex items-center justify-between w-full bg-[#1a1a2e] px-10 h-[70px] transition`}>
      <div className={`${styles.section} flex items-center justify-between w-full`}>

        {/* Categories dropdown */}
        <div className="relative" onClick={() => setDropDown(!dropDown)}>
          <div className="hidden 1000px:flex items-center gap-2 h-[38px] px-3 bg-white/10 border border-white/15 rounded-lg cursor-pointer">
            <BiMenuAltLeft size={18} className="text-white" />
            <span className="text-sm font-medium text-white">All Categories</span>
            <IoIosArrowDown size={14} className="text-white/60" />
          </div>
          {dropDown && (
            <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
          )}
        </div>

        {/* Nav links */}
        <Navbar active={activeHeading} />

        {/* Icons */}
        <div className="flex items-center gap-1">
          <div className="relative w-[38px] h-[38px] flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/10" onClick={() => setOpenWishlist(true)}>
            <AiOutlineHeart size={20} color="rgba(255,255,255,0.8)" />
            <span className="absolute top-1 right-1 w-[15px] h-[15px] bg-teal-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
              {wishlist?.length}
            </span>
          </div>
          <div className="relative w-[38px] h-[38px] flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/10" onClick={() => setOpenCart(true)}>
            <AiOutlineShoppingCart size={20} color="rgba(255,255,255,0.8)" />
            <span className="absolute top-1 right-1 w-[15px] h-[15px] bg-teal-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
              {cart?.length}
            </span>
          </div>
          <div className="w-[38px] h-[38px] flex items-center justify-center cursor-pointer">
            {isAuthenticated ? (
              <Link to="/profile">
                <img src={user?.avatar?.url} alt="" className="w-[32px] h-[32px] rounded-full ring-2 ring-teal-400/50 object-cover" />
              </Link>
            ) : (
              <Link to="/login"><CgProfile size={22} color="rgba(255,255,255,0.8)" /></Link>
            )}
          </div>
        </div>
      </div>

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <WishList setOpenWishlist={setOpenWishlist} />}
    </div>

    {/* ── Mobile Header ── */}
    <div className={`${active ? "shadow-sm fixed top-0 left-0 z-10" : ""} w-full h-[54px] bg-white flex items-center justify-between px-4 800px:hidden border-b border-gray-100`}>
      <div className="w-[36px] h-[36px] flex items-center justify-center rounded-lg cursor-pointer" onClick={() => setOpen(true)}>
        <BiMenuAltLeft size={24} />
      </div>
      <Link to="/"><img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" className="h-7" /></Link>
      <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
        <AiOutlineShoppingCart size={24} />
        <span className="absolute -top-1 -right-1 w-[15px] h-[15px] bg-teal-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
          {cart?.length}
        </span>
      </div>
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <WishList setOpenWishlist={setOpenWishlist} />}
    </div>

    {/* ── Mobile Sidebar ── */}
    {open && (
      <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setOpen(false)}>
        <div className="fixed top-0 left-0 w-[72%] max-w-[300px] h-screen bg-white z-30 flex flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>

          {/* Sidebar top */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Menu</span>
            <div className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-50" onClick={() => setOpen(false)}>
              <RxCross1 size={14} />
            </div>
          </div>

          {/* Mobile search — no reload, just filter */}
          <div className="px-4 py-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-[36px] px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-teal-500"
            />
            {searchData && searchData.length > 0 && (
              <div className="mt-1 border border-gray-100 rounded-lg overflow-hidden">
                {searchData.map((i) => (
                  <Link to={`/product/${i._id}`} key={i._id} onClick={() => setOpen(false)}>
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <img src={i.images?.[0]?.url} alt="" className="w-8 h-8 rounded-md object-cover" />
                      <span className="text-sm text-gray-800">{i.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <Navbar active={activeHeading} />

          {/* Become seller */}
          <div className="px-4 py-3 border-t border-gray-100">
            <Link to="/shop-create">
              <button className="w-full h-[36px] bg-teal-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1">
                Become Seller <IoIosArrowForward size={14} />
              </button>
            </Link>
          </div>

          {/* User */}
          <div className="px-4 py-4 border-t border-gray-100 mt-auto flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <img src={user?.avatar?.url} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-teal-400" />
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm font-medium text-teal-600">Login</Link>
                <span className="text-gray-300">/</span>
                <Link to="/sign-up" className="text-sm font-medium text-teal-600">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default Header
