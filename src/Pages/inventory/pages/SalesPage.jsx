import React, { useEffect } from "react";

import BlueCard from "../components/BlueCard";
import Snippet from "../components/Snippet";
import { Link } from "react-router-dom";
import RouteNav from "../components/RouteNav";
import { useGlobalContext } from "../../../context";
import SalesListCart from "../components/SalesListCart";

const SalesPage = () => {
  const { salesData } = useGlobalContext();

  return (
    <div class="page-route-container">
      <RouteNav title="Inventory > Sales" />
      <div class="page-content flex h-full w-full flex-col items-start justify-start gap-4">
        <div class="flex w-full flex-col gap-2">
          <h1 class="title-text">actions</h1>
          <div class="flex flex-row w-full   gap-4">
            <Link to="add-sales" className="action-link-btn">
              Add sales
            </Link>
          </div>
        </div>
        <div class=" flex w-full flex-col lg:flex-row gap-2">
          <div class="flex-1 list-container">
            <div class="list-container-top">
              <div>
                <div class="mb-2 flex flex-row items-center gap-3">
                  <h1 class="title-text">Sales list</h1>
                  {/* <Snippet title="116 total" color="purple" /> */}
                </div>
              </div>
              <div class="flex flex-row gap-5"></div>
            </div>
            <div class="flex flex-col h-full w-full grid-cols-2">
              <div class="list-rows-header">
                <h1 class=" col-span-6">billId</h1>
                <h1 class=" col-span-4">price</h1>
                <h1 class=" col-span-2">options</h1>
              </div>
              {salesData?.map((item) => {
                const { billId, date, totalPrice } = item;

                return (
                  <div className="list-rows">
                    <div className="col-span-6 flex flex-row items-center gap-3">
                      <div>
                        <h1 className="">{billId}</h1>
                      </div>
                    </div>

                    <p className=" col-span-4">
                      {/* {date.toISOString().split("T")[0]} */}
                      {date}
                    </p>
                    <p className=" col-span-2"> ₹{totalPrice}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
