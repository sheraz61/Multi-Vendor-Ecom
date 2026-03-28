import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx";
import Checkout from "../components/Checkout/Checkout.jsx";
function CheckoutPage() {
  return (
    <div>
        <Header/>
        <br />
        <br />
        <CheckoutSteps active={1} />
        <Checkout/>
        <br />
        <br />
        <Footer/>
    </div>
  )
}

export default CheckoutPage