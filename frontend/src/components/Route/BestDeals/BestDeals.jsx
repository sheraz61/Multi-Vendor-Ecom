import React, { useEffect, useState } from 'react'
// import { productData } from '../../../static/data';
import ProductCard from "../ProductCard/ProductCard.jsx";
import styles from "../../../styles/style";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../../redux/actions/product";
import Loader from "../../Layout/Loader.jsx";
const BestDeals = () => {
  const [data, setData] = useState([]);
  const {allProducts } = useSelector((state) => state.products);
  console.log(allProducts);
  
  // const dispatch = useDispatch()
  useEffect(() => {
     const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out); 
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive)
  }, [allProducts]);
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {
            data && data.length !== 0 && (
              <>
                {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default BestDeals
