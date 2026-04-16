import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/style";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

function ProductDetails({ data }) {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1)
  }
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  }
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };



  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product?.reviews?.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);
  return (
   // Outer container — clean card grid
<div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
  <div className="grid grid-cols-1 800px:grid-cols-2">

    {/* Left — Gallery */}
    <div className="p-8 border-b 800px:border-b-0 800px:border-r border-gray-100">
      <img
        src={`${data?.images[select]?.url}`}
        alt=""
        className="w-full aspect-square object-cover rounded-lg bg-gray-50"
      />
      <div className="flex gap-2 mt-3">
        {data?.images.map((i, index) => (
          <img
            key={index}
            src={`${i?.url}`}
            alt=""
            onClick={() => setSelect(index)}
            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border
              ${select === index ? "border-2 border-teal-500" : "border-gray-200"}`}
          />
        ))}
      </div>
    </div>

    {/* Right — Info */}
    <div className="p-8 flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-2xl text-gray-900 leading-snug">{data?.name}</h1>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{data?.description}</p>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-gray-900">{data?.discountPrice}$</span>
        {data?.originalPrice && (
          <span className="text-base text-gray-400 line-through">{data?.originalPrice}$</span>
        )}
      </div>

      {/* Qty + Wishlist + Cart */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={decrementCount}
            className="w-9 h-9 border border-gray-200 rounded-l-lg flex items-center justify-center text-lg hover:bg-gray-50">−</button>
          <span className="w-11 h-9 border-t border-b border-gray-200 flex items-center justify-center text-sm font-medium">{count}</span>
          <button onClick={incrementCount}
            className="w-9 h-9 border border-gray-200 rounded-r-lg flex items-center justify-center text-lg hover:bg-gray-50">+</button>
        </div>
        <div className="flex items-center gap-2">
          {click ? (
            <AiFillHeart size={22} className="cursor-pointer text-red-500" onClick={() => removeFromWishlistHandler(data)} />
          ) : (
            <AiOutlineHeart size={22} className="cursor-pointer text-gray-400" onClick={() => addToWishlistHandler(data)} />
          )}
          <button
            onClick={() => addToCartHandler(data._id)}
            className="flex items-center gap-2 h-10 px-5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg">
            <AiOutlineShoppingCart size={16} /> Add to cart
          </button>
        </div>
      </div>

      {/* Shop info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <img src={`${data?.shop?.avatar?.url}`} className="w-11 h-11 rounded-full object-cover" alt="" />
        </Link>
        <div>
          <Link to={`/shop/preview/${data?.shop._id}`}>
            <p className="text-sm font-medium text-gray-900">{data?.shop?.name}</p>
          </Link>
          <p className="text-xs text-gray-400">({averageRating}/5) Ratings</p>
        </div>
        <button onClick={handleMessageSubmit}
          className="ml-auto flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <AiOutlineMessage size={14} /> Message
        </button>
      </div>
    </div>
  </div>
</div>
  )
}


const ProductdetailsInfo = ({ data, products,
  totalReviewsLength,
  averageRating, }) => {
  const [active, setActive] = useState(1)

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
          
            data?.reviews?.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data?.reviews?.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
export default ProductDetails