import React, { useEffect } from "react";
import RouteNav from "./components/RouteNav";
import BlueCard from "./components/BlueCard";
import ListCard from "./components/ListCard";
import Snippet from "./components/Snippet";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../context";
import PurchaseOrder from "./pages/PurchaseOrder";
import AllRawMaterials from "../RawMaterials/AllRawMaterials";

const Inventory = () => {
  const { rawMaterials, getColor, purchaseOrders } = useGlobalContext();
  const filterOptions = ["vegetable", "oils", "meat", "other"];
  const availableFilterOptions = ["available", "low stock", "out of stock"];

  const [filter, setFilter] = React.useState(null);
  const [availableFilter, setAvailableFilter] = React.useState(null);
  const [outOfStocks, setOutOfStocks] = React.useState(null);
  const [availableStocks, setAvailableStocks] = React.useState(null);

  useEffect(() => {
    if (availableFilter) {
      const getAvailability = (availableStock, minimumStock) => {
        if (availableStock <= minimumStock) {
          return "out of stock";
        } else if (availableStock >= Math.floor(minimumStock * 1.75)) {
          return "available";
        } else if (availableStock >= Math.floor(minimumStock * 1.5)) {
          return "low stock";
        }
      };
      const isAvailable = getAvailability;
    } else {
    }
  }, [availableFilter]);

  useEffect(() => {
    const out = rawMaterials.filter((item) => {
      return item.availableStock <= item.minimumStock;
    });
    const low = rawMaterials.filter((item) => {
      return (
        item.availableStock > item.minimumStock &&
        item.availableStock < Math.floor(item.minimumStock * 1.75)
      );
    });
    const available = rawMaterials.filter((item) => {
      return (
        item.availableStock > item.minimumStock &&
        item.availableStock > Math.floor(item.minimumStock * 1.75)
      );
    });

    console.log(out);

    setOutOfStocks([...out, ...low, ...available]);
  }, [rawMaterials]);

  return (
    <div className="page-route-container bg-gray-50 min-h-screen py-12 px-10 text-gray-800 font-sans">
      <div className="page-content flex flex-col w-full gap-10">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-700 tracking-tight">Actions</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a section to manage your workflow</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
          {/* Raw Materials */}
          <a
            href="inventory/raw-materials"
            className="block rounded-2xl bg-gradient-to-r from-blue-100 to-blue-50 p-6 shadow-md hover:shadow-lg border border-blue-200 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-blue-600 bg-blue-200 p-2 rounded-full">
                📦
              </div>
              <h2 className="text-lg font-semibold text-blue-800">Raw Materials</h2>
            </div>
            <p className="text-sm text-gray-600">Manage your raw stock and supplies.</p>
          </a>

          {/* Purchase Orders */}
          <a
            href="inventory/purchase-order"
            className="block rounded-2xl bg-gradient-to-r from-green-100 to-green-50 p-6 shadow-md hover:shadow-lg border border-green-200 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-green-600 bg-green-200 p-2 rounded-full">
                🧾
              </div>
              <h2 className="text-lg font-semibold text-green-800">Purchase Orders</h2>
            </div>
            <p className="text-sm text-gray-600">Track and create your purchase documents.</p>
          </a>

          {/* Sales */}
          <a
            href="inventory/sales"
            className="block rounded-2xl bg-gradient-to-r from-purple-100 to-purple-50 p-6 shadow-md hover:shadow-lg border border-purple-200 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-purple-600 bg-purple-200 p-2 rounded-full">
                💰
              </div>
              <h2 className="text-lg font-semibold text-purple-800">Sales</h2>
            </div>
            <p className="text-sm text-gray-600">Monitor and manage your sales records.</p>
          </a>
        </div>

        {/* Raw Materials Section */}
        <div className="w-full mt-6 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <AllRawMaterials />
        </div>

      </div>
    </div>




  );
};

export default Inventory;
