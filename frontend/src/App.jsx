import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { LoginPage, SignupPage, ActivationPage, HomePage, EventsPage, ProductPage, BestSellingPage, FAQPage, ProductDetailsPage, ProfilePage, CheckoutPage, PaymentPage, OrderSuccessPage, ShopCreatePage, SellerActivationPage, ShopLoginPage ,OrderDetailsPage,TrackOrderPage} from './routes/Routes.js'
import { ShopHomePage, ShopDashboardPage, ShopCreateProduct, ShopAllProduct, ShopCreateEvents, ShopAllEvent, ShopAllCoupons, ShopPreviewPage ,ShopAllOrders,ShopOrderDetails,ShopAllRefunds,ShopSettingsPage} from './routes/ShopRoutes.js'
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import Store from './redux/store';
import { useDispatch } from "react-redux";
import { loadUser } from './redux/actions/user';
import { loadSeller } from './redux/actions/shop';
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import SellerProtectedRoute from './routes/SellerProtectedRoute.jsx';
import {Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { server } from './server.js';
const App = () => {
  const dispatch = useDispatch();
const [stripeApiKey,setStripeApiKey]=useState('')
async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }
  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadSeller());
    dispatch(getAllProducts());
    dispatch(getAllEvents());
    getStripeApikey()
  }, [dispatch])
  
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SignupPage />} />
          <Route path='/activation/:activation_token' element={<ActivationPage />} />
          <Route path='/shop/activation/:activation_token' element={<SellerActivationPage />} />
          <Route path='/products' element={<ProductPage />} />
          <Route path='/product/:id' element={<ProductDetailsPage />} />
          <Route path='/best-selling' element={<BestSellingPage />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/checkout' element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                {stripeApiKey ? (
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <PaymentPage />
                  </Elements>
                ) : null}
              </ProtectedRoute>
            }
          />
          <Route path='/order/success/' element={<OrderSuccessPage />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/user/order/:id' element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
          <Route path='/user/track/order/:id' element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          } />
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          <Route path='/shop-create' element={<ShopCreatePage />} />
          <Route path='/shop-login' element={<ShopLoginPage />} />
          <Route path='/shop/:id' element={
            <SellerProtectedRoute
            >
              <ShopHomePage />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard' element={
            <SellerProtectedRoute
            >
              <ShopDashboardPage />
            </SellerProtectedRoute>
          } />
          <Route path='/order/:id' element={
            <SellerProtectedRoute
            >
              <ShopOrderDetails />
            </SellerProtectedRoute>
          } />
          
          <Route path='/dashboard-create-product' element={
            <SellerProtectedRoute
            >
              <ShopCreateProduct />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard-products' element={
            <SellerProtectedRoute
            >
              <ShopAllProduct />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard-create-event' element={
            <SellerProtectedRoute
            >
              <ShopCreateEvents />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard-events' element={
            <SellerProtectedRoute
            >
              <ShopAllEvent />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard-orders' element={
            <SellerProtectedRoute
            >
              <ShopAllOrders />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard-coupons' element={
            <SellerProtectedRoute
            >
              <ShopAllCoupons />
            </SellerProtectedRoute>
          } />
          <Route path='/dashboard-refunds' element={
            <SellerProtectedRoute
            >
              <ShopAllRefunds />
            </SellerProtectedRoute>
          } />
          <Route path='/settings' element={
            <SellerProtectedRoute
            >
              <ShopSettingsPage />
            </SellerProtectedRoute>
          } />

        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </>
  )
}

export default App
