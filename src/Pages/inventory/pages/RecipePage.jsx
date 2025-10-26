import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import RouteNav from "../components/RouteNav";
import { useGlobalContext } from "../../../context";

const RecipePage = () => {
  const { recipes } = useGlobalContext();
  const filterOptions = ["vegetable", "oils", "meat", "other"];

  const [filter, setFilter] = React.useState(null);

  return (
    <div class="page-route-container">
      <RouteNav title="Recipe" />
      <div class="page-content flex h-full w-full flex-col items-start justify-start gap-4">
        <div class="flex w-full flex-col gap-2">
          <h1 class="title-text">actions</h1>
          <div class="flex flex-row w-full   gap-4">
            <Link to="add-recipe" className="action-link-btn">
              Add Recipie
            </Link>
          </div>
        </div>
        <div class=" flex w-full flex-col lg:flex-row gap-2">
          <div class="flex-1 list-container">
            <div class="list-container-top">
              <div>
                <div class="mb-2 flex flex-row items-center gap-3">
                  <h1 class="title-text">Recipes List</h1>
                  {/* <Snippet title="116 total" color="purple" /> */}
                </div>
              </div>
              <div class="flex flex-row gap-5">
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
            <div class="flex flex-col h-full w-full grid-cols-2">
              <div class="list-rows-header">
                <h1 class=" col-span-4">Name</h1>
                <h1 class=" col-span-3">category</h1>
                <h1 class=" col-span-3">price</h1>
                <h1 class=" col-span-2">options</h1>
              </div>
              {recipes?.map((item) => {
                return (
                  <div className="list-rows">
                    <div className="col-span-4 flex flex-row items-center gap-3">
                      <div>
                        <h1 className="">{item.name}</h1>
                      </div>
                    </div>

                    <p className="col-span-3">{item.category}</p>
                    <p className="col-span-3">{item.sellingPrice}</p>
                    <div className=" col-span-2 flex items-center gap-2">
                      <div className="icon-div">
                        <span className="material-symbols-outlined">
                          {" "}
                          edit{" "}
                        </span>
                      </div>
                    </div>
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

export default RecipePage;
