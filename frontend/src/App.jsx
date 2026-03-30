import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { LoginPage, SignupPage, ActivationPage, HomePage, EventsPage, ProductPage, BestSellingPage, FAQPage, ProductDetailsPage, ProfilePage, CheckoutPage, PaymentPage, OrderSuccessPage, ShopCreatePage, SellerActivationPage, ShopLoginPage } from './routes/Routes.js'
import { ShopHomePage,ShopDashboardPage ,ShopCreateProduct , ShopAllProduct,ShopCreateEvents,ShopAllEvent,ShopAllCoupons} from './routes/ShopRoutes.js'
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import Store from './redux/store';
import { loadUser } from './redux/actions/user';
import { loadSeller } from './redux/actions/shop';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import SellerProtectedRoute from './routes/SellerProtectedRoute.jsx';
const App = () => {
  

  useEffect(() => {
    Store.dispatch(loadUser())
    Store.dispatch(loadSeller())

  }, [])
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
          <Route path='/product/:name' element={<ProductDetailsPage />} />
          <Route path='/best-selling' element={<BestSellingPage />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/checkout' element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/order/success/:id' element={<OrderSuccessPage />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

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
          <Route path='/dashboard-coupons' element={
            <SellerProtectedRoute
            >
              <ShopAllCoupons />
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
