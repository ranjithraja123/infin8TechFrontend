import React, { useEffect } from "react";
import RouteNav from "../components/RouteNav";
import BlueCard from "../components/BlueCard";
import ListCard from "../components/ListCard";
import Snippet from "../components/Snippet";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import InventoryRawmaterials from "../../../Components/InventoryRawMaterials/InventoryRawmaterials";
import AllRawMaterials from "../../RawMaterials/AllRawMaterials";
import AddProducts from "../../RawMaterials/AddProducts";

const RawMaterials = () => {
  const { rawMaterials, setRawMaterials } = useGlobalContext();
  const filterOptions = ["vegetable", "oils", "meat", "other"];
  const availableFilterOptions = ["available", "low stock", "out of stock"];

  const [filter, setFilter] = React.useState(null);
  const [availableFilter, setAvailableFilter] = React.useState(null);


  return (
    <div class="page-route-container">
      <RouteNav title="Inventory > Raw materials" />
      <div class="page-content flex h-full w-full flex-col items-start justify-start gap-4">
        <div class="flex w-full flex-col gap-2">
          <h1 class="title-text">actions</h1>
          <div class="grid w-full   gap-4">
            {/* <BlueCard title="Attendance" to="/teachers/attendance" />
            <BlueCard title="Salary Update" to="/teachers/salary-update" />
            <BlueCard title="Feedback List" to="/teachers/feedback" /> */}
            <Link to="add-item" className="action-link-btn">
              add item1
            </Link>
            <AddProducts />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RawMaterials;
