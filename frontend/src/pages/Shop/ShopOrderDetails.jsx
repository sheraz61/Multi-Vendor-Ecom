import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import Footer from '../../components/Layout/Footer.jsx';
import OrderDetails from "../../components/Shop/OrderDetails.jsx";
function ShopOrderDetails() {
  return (
    <div>
         <DashboardHeader />
         <OrderDetails/>
        <Footer/>
    </div>
  )
}

export default ShopOrderDetails