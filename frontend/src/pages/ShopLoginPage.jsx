import React, { useEffect } from 'react'
import ShopLogin from '../components/Shop/ShopLogin.jsx'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function ShopLoginPage() {
  const { isSeller,loadingSeller } = useSelector((state) => state.shop);
  const navigate = useNavigate()
  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`)
    }
  }, [loadingSeller,isSeller])
  return (
    <div>
      <ShopLogin />
    </div>
  )
}

export default ShopLoginPage
