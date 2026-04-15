import React from 'react'
import styles from '../../styles/style'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopPreviewPage = () => {
  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
      <div className="flex w-full flex-col gap-6 py-6 sm:py-8 800px:flex-row 800px:items-start 800px:justify-between 800px:gap-8 800px:py-10">
        <aside className="w-full shrink-0 overflow-hidden rounded-[4px] bg-white shadow-sm 800px:sticky 800px:top-10 800px:z-10 800px:w-[25%] 800px:max-h-[min(90vh,100vh-5rem)] 800px:overflow-y-auto">
          <ShopInfo isOwner={false} />
        </aside>
        <section className="w-full min-w-0 flex-1 rounded-[4px] bg-white p-3 shadow-sm sm:p-5 800px:mt-0 800px:w-[72%] 800px:bg-transparent 800px:p-0 800px:shadow-none">
          <ShopProfileData isOwner={false} />
        </section>
      </div>
    </div>
  )
}

export default ShopPreviewPage