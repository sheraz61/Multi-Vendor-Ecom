import React from 'react'
import AdminSideBar from '../../components/Admin/Layout/AdminSideBar'
import AdminHeader from '../../components/Admin/Layout/AdminHeader'
import AllEvents from '../../components/Admin/AllEvents.jsx'

function AdminDashboardEvents() {
  return (
      <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={6} />
          </div>
       <AllEvents/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardEvents