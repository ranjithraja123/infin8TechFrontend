import React, { useEffect, useState } from "react";
import RouteNav from "../components/RouteNav";
import { getTotalPrice } from "../utils";
import { useGlobalContext } from "../../../context";
import { useParams } from "react-router-dom";

const AddPurchaseItem = () => {
  const { itemIdP } = useParams();

  const { rawMaterials, setRawMaterials, purchaseOrders, setPurchaseOrders } =
    useGlobalContext();

  const [errors, setErrors] = useState({});

  const [seletingItems, setSelectingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    itemId: itemIdP != 0 ? itemIdP : null,
    itemName: "",
  });
  const [addedData, setAddedData] = useState([]);
  const [formInput, setFormInput] = useState({
    id: "",
    itemId: "",
    itemName: "",
    category: "",
    unit: "",
    pricePerUnit: 0,
    purchasedDate: "",
    purchasedStock: 0,
    gst: 0,
    // img: "https://source.washu.edu/app/uploads/2015/11/Tomato250-1.jpg",
    totalPrice: 0,
  });

  const handleInputChange = (e) => {
    // For number fields, validate before updating state
    if (e.target.type === "number") {
      const value = e.target.value;

      // Allow empty string (so field can be cleared)
      if (value === "") {
        setFormInput({ ...formInput, [e.target.name]: value });
        return;
      }

      // Only allow positive numbers
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        return; // Don't update state for invalid numbers
      }

      setFormInput({ ...formInput, [e.target.name]: numValue });
      return;
    }

    // For non-number fields
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const saveItemDetails = () => {
    const newErrors = {};
    if (!formInput.itemId.trim()) newErrors.itemId = "Item ID is required.";
    if (!formInput.itemName.trim())
      newErrors.itemName = "Item name is required.";
    if (!formInput.category) newErrors.category = "Category is required.";
    if (!formInput.unit) newErrors.unit = "Unit is required.";
    if (!formInput.pricePerUnit || formInput.pricePerUnit <= 0)
      newErrors.pricePerUnit = "Price must be greater than 0.";
    if (!formInput.purchasedStock || formInput.purchasedStock <= 0)
      newErrors.purchasedStock = "Stock must be greater than 0.";
    if (!formInput.purchasedDate)
      newErrors.purchasedDate = "Purchase date is required.";
    if (formInput.gst < 0 || formInput.gst > 100)
      newErrors.gst = "GST must be between 0 and 100.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setAddedData([
      ...addedData,
      {
        ...formInput,
        id: Date.now(),
        totalPrice: getTotalPrice(
          formInput.pricePerUnit,
          formInput.purchasedStock,
          formInput.gst
        ).total,
      },
    ]);
  };

  const saveData = () => {
    if (addedData.length === 0) {
      console.warn("No data to save");
      return;
    }

    try {
      // Update raw materials stock
      const updatedMaterials = rawMaterials.map((material) => {
        const purchaseItems = addedData.filter(
          (item) => item.itemId === material.id
        );

        if (purchaseItems.length > 0) {
          let totalCost = 0;
          // Validate stock value
          purchaseItems.forEach((item) => {
            totalCost += item.purchasedStock;
          });
          return {
            ...material,
            availableStock: material.availableStock + Number(totalCost),
          };
        }
        return material;
      });

      // Update state (assuming you're using React state)
      setRawMaterials([...updatedMaterials]);
      setPurchaseOrders([...addedData, ...purchaseOrders]);
      setAddedData([]);

      // Optional: Show success message
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const items = rawMaterials.map((item) => {
      if (itemIdP != 0 && item.id == itemIdP) {
        setSelectedItem({ itemName: item.itemName, itemId: itemIdP });
      }

      return {
        itemId: item.id,
        itemName: item.itemName,
      };
    });
    setSelectingItems(items);
  }, [itemIdP]);

  useEffect(() => {
    if (selectedItem.itemId) {
      const details = rawMaterials.filter((item) => {
        return item.id == selectedItem.itemId;
      });
      setFormInput({
        ...formInput,
        id: "",
        itemId: details[0].id,
        itemName: details[0].itemName,
        category: details[0].category,
        unit: details[0].unit,
        pricePerUnit: details[0].pricePerUnit,
        gst: details[0].gst,
        purchasedDate: "",
        purchasedStock: 0,
      });
    }
  }, [selectedItem.itemId, itemIdP]);

  return (
    <div className="page-route-container">
      <RouteNav title="Inventory > Inventory > PurchaseOrder" />

      <div className="page-content">
        {/* form */}
        <section className="form-container">
          <h1 className="text-xl font-bold text-semibold capitalize dark:text-white">
            Add Purchase Order details
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveItemDetails();
            }}
          >
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
              {/* select item */}
              {itemIdP == 0 && (
                <div className="col-span-3 mb-6">
                  <label className="form-label-black" htmlFor="selectedItem">
                    Select raw material
                  </label>
                  <select
                    onChange={(e) => {
                      setSelectedItem({
                        itemId: e.target.value,
                        itemName: e.target.itemName,
                      });
                    }}
                    value={selectedItem.itemName}
                    name="selectedItem"
                    className="formInput"
                  >
                    <option value="" disabled hidden>
                      Select item
                    </option>
                    {seletingItems.map((ite, idx) => {
                      return (
                        <option
                          key={idx}
                          name={ite.itemName}
                          value={ite.itemId}
                        >
                          {ite.itemName}
                        </option>
                      );
                    })}
                  </select>
                  {errors.itemId && (
                    <p className="text-sm text-red-500">
                      please select raw material
                    </p>
                  )}
                </div>
              )}

              {/* stock amount */}
              <div>
                <label className="form-label-black" htmlFor="purchasedStock">
                  purchased stock{" "}
                  {formInput.unit.length > 0 && `per (${formInput.unit}) `}
                </label>
                <input
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.purchasedStock}
                  name="purchasedStock"
                  id="purchasedStock"
                  type="number"
                  className="formInput"
                />
                {errors.purchasedStock && (
                  <p className="text-sm text-red-500">
                    {errors.purchasedStock}
                  </p>
                )}
              </div>
              {/*  GST */}
              <div>
                <label className="form-label-black" htmlFor="gst">
                  GST (%)
                </label>
                <input
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.gst}
                  name="gst"
                  id="gst"
                  type="number"
                  className="formInput"
                />
                {errors.gst && (
                  <p className="text-sm text-red-500">{errors.gst}</p>
                )}
              </div>
              {/* date picker */}
              <div>
                <label className="form-label-black" htmlFor="date">
                  Date
                </label>
                <input
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.purchasedDate}
                  name="purchasedDate"
                  id="date"
                  type="date"
                  className="formInput"
                />
                {errors.purchasedDate && (
                  <p className="text-sm text-red-500">{errors.purchasedDate}</p>
                )}
              </div>

              {/* item name */}
              <div>
                <label className="form-label-black" htmlFor="itemName">
                  item Name
                </label>
                <input
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.itemName}
                  name="itemName"
                  id="itemName"
                  type="text"
                  className="formInput"
                  disabled={true}
                />
              </div>
              {/* category */}
              <div>
                <label className="form-label-black" htmlFor="unit">
                  Select category
                </label>

                <select
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.category}
                  name="category"
                  className="formInput"
                  disabled={true}
                >
                  <option value="" disabled hidden>
                    Select category
                  </option>
                  <option>vegetable</option>
                  <option>fruits</option>
                  <option>oils</option>
                  <option>meat</option>
                </select>
              </div>
              {/* unit of measurement */}
              <div>
                <label className="form-label-black" htmlFor="unit">
                  Select unit
                </label>

                <select
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.unit}
                  name="unit"
                  className="formInput"
                  disabled={true}
                >
                  <option value="" disabled hidden>
                    Select unit
                  </option>
                  <option>kg</option>
                  <option>ltr</option>
                  <option>pcs</option>
                  <option>grams</option>
                </select>
              </div>
              {/*    purchase price per unit */}
              <div>
                <label className="form-label-black" htmlFor="price">
                  purchase price{" "}
                  {formInput.unit.length > 0 && "per " + formInput.unit}
                </label>
                <input
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formInput.pricePerUnit}
                  name="pricePerUnit"
                  id="price"
                  type="number"
                  className="formInput"
                  disabled={true}
                />
              </div>
              <div></div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-gray-600">
                add details
              </button>
            </div>
          </form>
        </section>

        <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-20">
          <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
            addedData
          </h2>
          {addedData.length > 0 &&
            addedData.map((item) => {
              return (
                <div className="hover:bgColor grid w-full cursor-pointer grid-cols-12 items-center gap-2 border-b border-solid border-[#00000026] bg-white p-4">
                  <div className="col-span-3 flex flex-row items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={item.img}
                        alt=""
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <h1 className="title-text-md text-[#475569]">
                        {item.itemName}
                      </h1>
                    </div>
                  </div>
                  <div className="title-text-md col-span-2 flex flex-row flex-wrap items-center justify-start gap-3">
                    <div className="flex flex-row items-center gap-2">
                      purchased :{item.purchasedStock} {item.unit}
                    </div>
                  </div>

                  <p className="title-text-md col-span-2">
                    {item.purchasedDate}
                  </p>
                  <p className="title-text-md col-span-2">
                    {
                      getTotalPrice(
                        item.pricePerUnit,
                        item.purchasedStock,
                        item.gst
                      ).price
                    }
                    <br />+
                    {
                      getTotalPrice(
                        item.pricePerUnit,
                        item.purchasedStock,
                        item.gst
                      ).tax
                    }
                    <br />=
                    {
                      getTotalPrice(
                        item.pricePerUnit,
                        item.purchasedStock,
                        item.gst
                      ).total
                    }
                  </p>
                  <p className="title-text-md col-span-1">{item.category}</p>
                  <div className=" col-span-1 flex items-center gap-2">
                    <div className="icon-div">
                      <span className="material-symbols-outlined">delete</span>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => saveData()}
              className="px-8 py-4 leading-5 text-white transition-colors duration-200 text-xl transform bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-gray-600"
            >
              Save Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddPurchaseItem;
