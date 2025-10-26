import React, { useState, useEffect } from "react";
import RouteNav from "../components/RouteNav";
import { useGlobalContext } from "../../../context";

const AddSalesForm = () => {
  const { rawMaterials, recipes, setRawMaterials, setSalesData } =
    useGlobalContext();

  const [errors, setErrors] = useState({});
  const [ingErrors, setIngErrors] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formInput, setFormInput] = useState({
    billId: `BILL-${Date.now()}`,
    customerName: "",
    date: new Date().toISOString().split("T")[0],
    orderedItems: [],
    totalPrice: 0,
    paymentMethod: "cash",
    gst: 0,
  });

  // Item selection form
  const [itemForm, setItemForm] = useState({
    recipeId: "",
    quantity: 1,
    customPrice: null,
  });

  // Available recipes for selection
  const [availableRecipes, setAvailableRecipes] = useState([]);

  // Load available recipes
  useEffect(() => {
    setAvailableRecipes(recipes);
  }, [recipes]);

  // Handle main form changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle item form changes
  const handleItemFormChange = (e) => {
    const { name, value, type } = e.target;
    setItemForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Add item to bill
  const addItemToBill = () => {
    if (!itemForm.recipeId) {
      setIngErrors("Please select a recipe");
      return;
    }

    const selectedRecipe = recipes.find((r) => r.id === itemForm.recipeId);
    if (!selectedRecipe) {
      setIngErrors("Selected recipe not found");
      return;
    }

    const quantity = itemForm.quantity > 0 ? itemForm.quantity : 1;
    const price = itemForm.customPrice || selectedRecipe.sellingPrice;
    const total = price * quantity;

    const newItem = {
      recipeId: selectedRecipe.id,
      recipeName: selectedRecipe.name,
      quantity,
      unitPrice: price,
      totalPrice: total,
      ingredients: selectedRecipe.ingredients.map((ing) => ({
        ...ing,
        totalUsed: ing.usedStock * quantity,
      })),
    };

    setFormInput((prev) => ({
      ...prev,
      orderedItems: [...prev.orderedItems, newItem],
      totalPrice: prev.totalPrice + total,
    }));

    // Reset item form
    setItemForm({
      recipeId: "",
      quantity: 1,
      customPrice: null,
    });
    setIngErrors(null);
  };

  // Remove item from bill
  const removeItemFromBill = (index) => {
    const removedItem = formInput.orderedItems[index];
    setFormInput((prev) => ({
      ...prev,
      orderedItems: prev.orderedItems.filter((_, i) => i !== index),
      totalPrice: prev.totalPrice - removedItem.totalPrice,
    }));
  };

  // Update raw materials stock
  const updateRawMaterialsStock = (ingredients) => {
    const updatedMaterials = rawMaterials.map((material) => {
      const usedInItems = ingredients.filter(
        (ing) => ing.itemId === material.id
      );
      if (usedInItems.length === 0) return material;

      const totalUsed = usedInItems.reduce(
        (sum, ing) => sum + ing.totalUsed,
        0
      );
      const newStock = material.availableStock - totalUsed;

      if (newStock < 0) {
        throw new Error(`Insufficient stock for ${material.itemName}`);
      }

      return {
        ...material,
        availableStock: newStock,
      };
    });

    setRawMaterials(updatedMaterials);
  };

  // Save the complete bill
  const saveBill = () => {
    try {
      const newErrors = {};

      if (!formInput.customerName.trim()) {
        newErrors.customerName = "Customer name is required.";
      }

      if (!formInput.date) {
        newErrors.date = "Date is required.";
      }

      if (
        !Array.isArray(formInput.orderedItems) ||
        formInput.orderedItems.length === 0
      ) {
        newErrors.orderedItems = "At least one item must be ordered.";
      }

      if (formInput.totalPrice <= 0) {
        newErrors.totalPrice = "Total price must be greater than 0.";
      }

      if (formInput.gst < 0 || formInput.gst > 100) {
        newErrors.gst = "GST must be between 0 and 100.";
      }

      if (!formInput.paymentMethod.trim()) {
        newErrors.paymentMethod = "Payment method is required.";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      // Update raw materials stock
      const allIngredients = formInput.orderedItems.flatMap(
        (item) => item.ingredients
      );
      updateRawMaterialsStock(allIngredients);

      // Calculate final bill with GST
      const gstAmount = formInput.totalPrice * (formInput.gst / 100);
      const finalBill = {
        ...formInput,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        gstAmount,
        finalTotal: formInput.totalPrice + gstAmount,
      };

      // Here you would typically save to your backend/context
      setSalesData((prev) => [...prev, finalBill]);

      setSuccess("Bill saved successfully!");

      // Reset form after save
      setFormInput({
        billId: `BILL-${Date.now()}`,
        customerName: "",
        date: new Date().toISOString().split("T")[0],
        orderedItems: [],
        totalPrice: 0,
        paymentMethod: "cash",
        gst: 0,
      });
    } catch (error) {
      setErrors(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className="page-route-container">
      <RouteNav title="Inventory > Sales > Create Bill" />

      <div className="page-content">
        {/* Bill Form */}
        <section className="form-container">
          <h1 className="text-xl font-bold text-semibold capitalize">
            Create New Bill
          </h1>

          {errors.message && (
            <p className="text-red-500 border-red-500 border-2 my-2 w-full px-4 py-2 rounded-lg text-center capitalize bg-red-100">
              {errors.message}
            </p>
          )}

          {success && (
            <p className="text-green-500 border-green-500 border-2 my-2 w-full px-4 py-2 rounded-lg text-center capitalize bg-green-100">
              {success}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            {/* Bill Info */}
            <div>
              <label className="form-label-black" htmlFor="customerName">
                Customer Name
              </label>
              <input
                onChange={handleInputChange}
                value={formInput.customerName}
                name="customerName"
                id="customerName"
                type="text"
                className="formInput"
                required
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="form-label-black" htmlFor="billId">
                Bill ID
              </label>
              <input
                value={formInput.billId}
                name="billId"
                id="billId"
                type="text"
                className="formInput "
                disabled
              />
            </div>

            <div>
              <label className="form-label-black" htmlFor="date">
                Date
              </label>
              <input
                onChange={handleInputChange}
                value={formInput.date}
                name="date"
                id="date"
                type="date"
                className="formInput"
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="form-label-black" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                onChange={handleInputChange}
                value={formInput.paymentMethod}
                name="paymentMethod"
                id="paymentMethod"
                className="formInput"
                required
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="credit">Credit</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
              )}
            </div>

            <div>
              <label className="form-label-black" htmlFor="gst">
                GST (%)
              </label>
              <input
                onChange={handleInputChange}
                value={formInput.gst}
                name="gst"
                id="gst"
                type="number"
                min="0"
                max="30"
                step="0.1"
                className="formInput"
              />
              {errors.gst && (
                <p className="text-red-500 text-sm">{errors.gst}</p>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Item Selection */}
              <div>
                <label className="form-label-black" htmlFor="recipeId">
                  Recipe
                </label>
                <select
                  onChange={handleItemFormChange}
                  value={itemForm.recipeId}
                  name="recipeId"
                  id="recipeId"
                  className="formInput"
                >
                  <option value="" disabled>
                    Select recipe
                  </option>
                  {availableRecipes?.map((recipe) => {
                    return (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name} (₹{recipe.sellingPrice})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="form-label-black" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  onChange={handleItemFormChange}
                  value={itemForm.quantity}
                  name="quantity"
                  id="quantity"
                  type="number"
                  min="1"
                  className="formInput"
                />
              </div>

              {/* Custom Price */}
              <div>
                <label className="form-label-black" htmlFor="customPrice">
                  Custom Price (optional)
                </label>
                <input
                  onChange={handleItemFormChange}
                  value={itemForm.customPrice || ""}
                  name="customPrice"
                  id="customPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="formInput"
                  placeholder="Leave blank for default"
                />
              </div>
            </div>

            {ingErrors && <p className="text-red-500 text-sm">{ingErrors}</p>}
            {/* Add Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={addItemToBill}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Item to Bill
              </button>
            </div>

            {/* Items List */}
            {formInput.orderedItems.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Current Bill Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-black">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formInput.orderedItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.recipeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{item.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeItemFromBill(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {errors.orderedItems && (
              <p className="text-red-500 text-sm">{errors.orderedItems}</p>
            )}
          </div>

          {/* Bill Summary */}
          <div className="mt-8 p-4 bg-green-900 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-green-200">Subtotal:</p>
                <p className="text-xl font-bold">
                  ₹{formInput.totalPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-green-200">GST ({formInput.gst}%):</p>
                <p className="font-medium">
                  ₹{(formInput.totalPrice * (formInput.gst / 100)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-green-200">Total Amount:</p>
                <p className="text-xl font-bold">
                  ₹
                  {(formInput.totalPrice * (1 + formInput.gst / 100)).toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={saveBill}
              className="px-8 py-3 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Save Bill
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddSalesForm;
