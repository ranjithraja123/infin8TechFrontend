import React from "react";
import Snippet from "./Snippet";

const ListCard = ({
  id,
  itemName,
  desc,
  availableStock,
  minimumStock,
  unit,
  category,
  modifiedDate,
  img,
}) => {
  const getColor = () => {
    if (availableStock <= minimumStock) {
      return ["red", "out of stock"];
    } else if (availableStock >= Math.floor(minimumStock * 1.75)) {
      return ["green", "available"];
    } else if (availableStock >= Math.floor(minimumStock * 1.5)) {
      return ["yellow", "low stock"];
    }
  };
  return (
    <div className="list-rows flex">
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
          {desc && <h1 className="text-xs text-[#475569]">{desc}</h1>}
        </div>
      </div>
      <div className=" col-span-3 flex flex-row flex-wrap items-center justify-start gap-3">
        <div className="flex flex-row items-center gap-2">
          <h1 className="">
            {availableStock + unit}
            {"/" + minimumStock + unit}
          </h1>
          <Snippet title={getColor()[1]} color={getColor()[0]} />
          <h1 className=""></h1>
        </div>
        {/* <div className="flex flex-row items-center gap-2">
          <h1 className="">attendence</h1>
          <Snippet title="4%" color="green" />
        </div> */}
      </div>

      <p className=" col-span-2">{modifiedDate}</p>
      <p className=" col-span-2">{category}</p>
      <div className=" col-span-2 flex items-center gap-2">
        <div className="icon-div">
          <span className="material-symbols-outlined"> edit </span>
        </div>
        <div className="icon-div">
          <span className="material-symbols-outlined"> more_vert </span>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
