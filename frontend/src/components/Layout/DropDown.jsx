import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/style";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  };
  return (
    <div className="absolute top-[44px] left-0 w-[220px] bg-white border border-gray-100 rounded-lg z-30 overflow-hidden shadow-sm">
      {categoriesData && categoriesData.map((i, index) => (
        <div
          key={index}
          onClick={() => submitHandle(i)}
          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0"
        >
          <img src={i.image_Url} alt="" className="w-6 h-6 object-contain" />
          <span className="text-sm text-gray-800">{i.title}</span>
        </div>
      ))}
    </div>
  );
};

export default DropDown;