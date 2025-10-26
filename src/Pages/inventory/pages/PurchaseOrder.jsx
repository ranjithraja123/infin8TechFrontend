import React, { useEffect } from "react";

import BlueCard from "../components/BlueCard";
import Snippet from "../components/Snippet";
import { Link } from "react-router-dom";
import RouteNav from "../components/RouteNav";
import { useGlobalContext } from "../../../context";
import PurchaseListCard from "../components/PurchaseListCard";

const PurchaseOrder = () => {
  const { purchaseOrders } = useGlobalContext();
  const filterOptions = ["vegetable", "oils", "meat", "other"];
  const availableFilterOptions = ["available", "low stock", "out of stock"];

  const [filter, setFilter] = React.useState(null);
  const [availableFilter, setAvailableFilter] = React.useState(null);

  return (
    <div class="page-route-container">
      <RouteNav title="Inventory > PurchaseOrder" />
      <div class="page-content flex h-full w-full flex-col items-start justify-start gap-4">
        <div class="flex w-full flex-col gap-2">
          <h1 class="title-text">actions</h1>
          <div class="grid w-full   gap-4">
            <Link to="add-item/0" className="action-link-btn">
              add item
            </Link>
          </div>
        </div>
        <div class=" flex w-full flex-col gap-2">
          <h1 class="title-text">List</h1>
          <div class="list-container">
            <div class="list-container-top">
              <div>
                <div class="mb-2 flex flex-row items-center gap-3">
                  <h1 class="title-text">Purchase Order Items list</h1>
                  {/* <Snippet title="116 total" color="purple" /> */}
                </div>
              </div>
              <div class="flex flex-row gap-5">
                <div class="applyBorder flex flex-row items-center rounded-full px-3 outline-none focus:outline-none">
                  <input
                    type="text"
                    placeholder="Search.. "
                    class="w-full appearance-none border-0 border-none bg-transparent bg-none px-2 text-base focus:border-transparent focus:shadow-none focus:ring-0 focus:outline-none"
                  />
                  <span class="material-symbols-outlined"> search </span>
                </div>
                {/* <select
                  onChange={(event) => {
                    if (event.target.value === "select") {
                      setFilter(null);
                    } else {
                      setFilter(event.target.value);
                    }
                  }}
                  class="applyBorder hover:bgColor flex cursor-pointer flex-row items-center gap-2 rounded-full px-3 py-2"
                  placeholder="select"
                >
                  <option value="select">availability</option>
                  {availableFilter.map((option) => {
                    return <option value={option}>{option}</option>;
                  })}
                </select> */}
                <select
                  onChange={(event) => {
                    if (event.target.value === "select") {
                      setFilter(null);
                    } else {
                      setFilter(event.target.value);
                    }
                  }}
                  class="applyBorder hover:bgColor flex cursor-pointer flex-row items-center gap-2 rounded-full px-3 py-2"
                  placeholder="select"
                >
                  {/* <span class="material-symbols-outlined"> filter_list </span>
                  <div class="subText">filter</div> */}
                  <option value="select">all</option>
                  {filterOptions.map((option) => {
                    return <option value={option}>{option}</option>;
                  })}
                </select>
              </div>
            </div>
            <div class="flex-flex-col h-full w-full">
              <div class="list-rows-header">
                <h1 class="col-span-3">item name</h1>
                <h1 class="col-span-2">Stock bought</h1>
                <h1 class="col-span-2">modified date</h1>
                <h1 class="col-span-2">category</h1>
                <h1 class="col-span-2">cost</h1>
                <h1 class="col-span-1">options</h1>
              </div>
              {purchaseOrders?.map((item) => {
                if (filter) {
                  return (
                    item.category === filter && (
                      <PurchaseListCard
                        id={item.id}
                        itemId={item.itemName}
                        itemName={item.itemName}
                        purchasedStock={item.purchasedStock}
                        unit={item.unit}
                        category={item.category}
                        purchasedDate={item.purchasedDate}
                        img={item.img}
                        totalPrice={item.totalPrice}
                      />
                    )
                  );
                }
                return (
                  <PurchaseListCard
                    id={item.id}
                    itemId={item.itemName}
                    itemName={item.itemName}
                    purchasedStock={item.purchasedStock}
                    unit={item.unit}
                    pricePerUnit={item.pricePerUnit}
                    category={item.category}
                    purchasedDate={item.purchasedDate}
                    img={item.img}
                    totalPrice={item.totalPrice}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
