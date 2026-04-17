
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

    {/* Tab Nav */}
    <div className="flex w-full min-w-0 flex-col gap-4 800px:flex-row 800px:items-center 800px:justify-between">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { id: 1, label: "Products" },
          { id: 2, label: "Events" },
          { id: 3, label: "Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
              ${active === tab.id
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isOwner && (
        <Link to="/dashboard">
          <button className="h-9 px-5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
            Go to Dashboard
          </button>
        </Link>
      )}
    </div>

    <div className="mt-6" />

    {/* Products Tab */}
    {active === 1 && (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
        {products && products.map((i, index) => (
          <ProductCard data={i} key={index} isShop={true} />
        ))}
        {products && products.length === 0 && (
          <p className="col-span-full text-center py-10 text-sm text-gray-400">No products yet</p>
        )}
      </div>
    )}

    {/* Events Tab */}
    {active === 2 && (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {events && events.map((i, index) => (
            <ProductCard data={i} key={index} isShop={true} isEvent={true} />
          ))}
        </div>
        {events && events.length === 0 && (
          <p className="text-center py-10 text-sm text-gray-400">No events for this shop</p>
        )}
      </div>
    )}

    {/* Reviews Tab */}
    {active === 3 && (
      <div className="w-full flex flex-col gap-4">
        {allReviews && allReviews.map((item, index) => (
          <div key={index} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <img
              src={item.user.avatar?.url}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              alt=""
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">{item.user.name}</p>
                <Ratings rating={item.rating} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{item?.comment}</p>
              <p className="text-xs text-gray-400 mt-1">{format(item?.createdAt)}</p>
            </div>
          </div>
        ))}
        {allReviews && allReviews.length === 0 && (
          <p className="text-center py-10 text-sm text-gray-400">No reviews yet</p>
        )}
      </div>
    )}
  </div>
);

};

  

export default ShopProfileData;
