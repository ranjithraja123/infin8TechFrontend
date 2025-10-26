import React from "react";

const SalesListCart = ({
  id,
  name,
  category,
  unit,
  purchasedDate,
  pricePerUnit,
  sellingPrice,
}) => {
  return (
    <div className="list-rows">
      <div className="col-span-6 flex flex-row items-center gap-3">
        {/* <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div> */}
        <div>
          <h1 className="">{name}</h1>
        </div>
      </div>

      <p className="col-span-4">{sellingPrice}</p>
      <div className=" col-span-2 flex items-center gap-2">
        <div className="icon-div">
          <span className="material-symbols-outlined"> edit </span>
        </div>
      </div>
    </div>
  );
};

export default SalesListCart;
