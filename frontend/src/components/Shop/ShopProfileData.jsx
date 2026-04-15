
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/style";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { format } from "timeago.js";
const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-4 800px:flex-row 800px:items-center 800px:justify-between 800px:gap-3">
        <nav
          className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#e8e8e8] pb-3 800px:border-0 800px:pb-0"
          aria-label="Shop sections"
        >
          <button
            type="button"
            className={`cursor-pointer border-0 bg-transparent p-0 text-left font-[600] text-[15px] min-[400px]:text-[17px] 800px:text-[20px] ${
              active === 1 ? "text-red-500" : "text-[#333]"
            }`}
            onClick={() => setActive(1)}
          >
            Shop Products
          </button>
          <button
            type="button"
            className={`cursor-pointer border-0 bg-transparent p-0 text-left font-[600] text-[15px] min-[400px]:text-[17px] 800px:text-[20px] ${
              active === 2 ? "text-red-500" : "text-[#333]"
            }`}
            onClick={() => setActive(2)}
          >
            Running Events
          </button>
          <button
            type="button"
            className={`cursor-pointer border-0 bg-transparent p-0 text-left font-[600] text-[15px] min-[400px]:text-[17px] 800px:text-[20px] ${
              active === 3 ? "text-red-500" : "text-[#333]"
            }`}
            onClick={() => setActive(3)}
          >
            Shop Reviews
          </button>
        </nav>
        {isOwner && (
          <div className="w-full shrink-0 800px:w-auto">
            <Link to="/dashboard" className="block w-full 800px:w-auto">
              <div
                className={`${styles.button} !h-[42px] !w-full !rounded-[4px] 800px:!w-[150px]`}
              >
                <span className="text-[#fff]">Go Dashboard</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6" />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div key={index} className="my-4 flex w-full min-w-0">
                <img
                  src={item.user.avatar?.url}
                  className="h-[50px] w-[50px] shrink-0 rounded-full"
                  alt=""
                />
                <div className="min-w-0 pl-2">
                  <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
                    <h1 className="font-[600]">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">{format(item?.createdAt)}</p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );

};

  

export default ShopProfileData;
