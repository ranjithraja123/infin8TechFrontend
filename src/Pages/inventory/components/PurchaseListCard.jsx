import React from "react";
import { getTotalPrice } from "../utils";

const PurchaseListCard = ({
  id,
  itemId,
  itemName,
  category,
  purchasedStock,
  unit,
  pricePerUnit,
  purchasedDate,
  img,
  totalPrice,
}) => {
  return (
    <div className="list-rows">
      <div className="col-span-3 flex flex-row items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div>
          <h1 className="">{itemName}</h1>
        </div>
      </div>
      <div className=" col-span-2 flex flex-row flex-wrap items-center justify-start gap-3">
        <div className="flex flex-row items-center gap-2">
          <h1 className="">{purchasedStock + unit}</h1>
        </div>
      </div>
      <p className=" col-span-2">{purchasedDate}</p>
      <p className=" col-span-2">{category}</p>
      <p className=" col-span-2">{totalPrice}</p>
      <div className=" col-span-1 flex items-center gap-2">
        <div className="icon-div">
          <span className="material-symbols-outlined"> edit </span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseListCard;
