import React, { useEffect, useState } from "react";
import RouteNav from "../components/RouteNav";
import { useGlobalContext } from "../../../context";
import { useParams } from "react-router-dom";

const AddRecipiesForm = () => {
  const { rawMaterials, recipes, setRecipes } = useGlobalContext();

  // State for recipe form
  const [formInput, setFormInput] = useState({
    id: "",
    name: "",
    category: "",
    unit: "cup",
    pricePerUnit: 0,
    gst: 0,
    costPrice: 0,
    sellingPrice: 0,
    ingredients: [],
  });

  // State for ingredient form
  const [ingredientForm, setIngredientForm] = useState({
    itemId: "",
    usedStock: 0,
    stockUnit: "",
  });

  const [availableItems, setAvailableItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [ingError, setIngError] = useState(null);

  // Load available raw materials
  useEffect(() => {
    const items = rawMaterials.map((item) => ({
      itemId: item.id,
      itemName: item.itemName,
      unit: item.unit,
      pricePerUnit: item.pricePerUnit,
    }));
    setAvailableItems(items);
  }, [rawMaterials]);

  // Handle main form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle ingredient form changes
  const handleIngredientChange = (e) => {
    const { name, value, type } = e.target;
    setIngredientForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Add new ingredient to recipe
  const addIngredient = () => {
    if (!ingredientForm.itemId || !ingredientForm.usedStock) {
      setIngError("Please select an item and enter quantity");
      return;
    }

    const selectedItem = availableItems.find(
      (item) => item.itemId === ingredientForm.itemId
    );
    if (!selectedItem) {
      setIngError("Selected item not found");
      return;
    }

    const newIngredient = {
      itemId: ingredientForm.itemId,
      itemName: selectedItem.itemName,
      usedStock: ingredientForm.usedStock,
      stockUnit: selectedItem.unit || ingredientForm.stockUnit,
      price: selectedItem.pricePerUnit * ingredientForm.usedStock,
    };

    setFormInput((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
      costPrice: prev.costPrice + newIngredient.price,
    }));

    // Reset ingredient form
    setIngredientForm({
      itemId: "",
      usedStock: 0,
      stockUnit: "",
    });
    setIngError(null);
  };

  // Remove ingredient from recipe
  const removeIngredient = (index) => {
    const removedIngredient = formInput.ingredients[index];
    setFormInput((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
      costPrice: prev.costPrice - removedIngredient.price,
    }));
  };

  // Save the complete recipe
  const saveRecipe = () => {
    const newErrors = {};

    if (!formInput.name.trim()) newErrors.name = "Name is required.";
    if (!formInput.category.trim())
      newErrors.category = "Category is required.";
    if (!formInput.unit.trim()) newErrors.unit = "Unit is required.";
    if (formInput.pricePerUnit <= 0)
      newErrors.pricePerUnit = "Price per unit must be greater than 0.";
    if (formInput.gst < 0 || formInput.gst > 100)
      newErrors.gst = "GST must be between 0 and 100.";
    if (formInput.costPrice <= 0)
      newErrors.costPrice = "Cost price must be greater than 0.";
    if (formInput.sellingPrice <= 0)
      newErrors.sellingPrice = "Selling price must be greater than 0.";
    if (
      !Array.isArray(formInput.ingredients) ||
      formInput.ingredients.length === 0
    )
      newErrors.ingredients = "At least one ingredient is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Calculate final recipe details
    const finalRecipe = {
      ...formInput,
      id: formInput.id || Date.now().toString(),
      pricePerUnit: (formInput.costPrice * (1 + formInput.gst / 100)).toFixed(
        1
      ),
      sellingPrice: formInput.sellingPrice,
    };

    setRecipes((prev) => [...prev, finalRecipe]);
    alert("Recipe saved successfully!");

    // Reset form after save
    setFormInput({
      id: "",
      name: "",
      category: "",
      unit: "cup",
      pricePerUnit: 0,
      gst: 0,
      costPrice: 0,
      sellingPrice: 0,
      ingredients: [],
    });
  };

  return (
    <div className="page-route-container">
      <RouteNav title="Inventory > Recipes > Add Recipe" />

      <div className="page-content">
        {/* Recipe Form */}
        <section className="form-container">
          <h1 className="text-xl font-bold text-semibold capitalize">
            Add New Recipe
          </h1>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            {/* Recipe Name */}
            <div>
              <label className="form-label-black" htmlFor="name">
                Recipe Name
              </label>
              <input
                onChange={handleInputChange}
                value={formInput.name}
                name="name"
                id="name"
                type="text"
                className="formInput"
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="form-label-black" htmlFor="category">
                Category
              </label>
              <select
                onChange={handleInputChange}
                value={formInput.category}
                name="category"
                className="formInput"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="beverage">Beverage</option>
                <option value="snacks">Snacks</option>
                <option value="main course">Main Course</option>
                <option value="dessert">Dessert</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Serving Unit */}
            <div>
              <label className="form-label-black" htmlFor="unit">
                Serving Unit
              </label>
              <select
                onChange={handleInputChange}
                value={formInput.unit}
                name="unit"
                className="formInput"
                required
              >
                <option value="cup">Cup</option>
                <option value="plate">Plate</option>
                <option value="bowl">Bowl</option>
                <option value="piece">Piece</option>
              </select>
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit}</p>
              )}
            </div>

            {/* GST */}
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
                step="0.1"
                className="formInput"
              />
            </div>
            {errors.gst && <p className="text-sm text-red-500">{errors.gst}</p>}
          </div>

          {/* Ingredients Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Ingredients</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Ingredient Selection */}
              <div>
                <label className="form-label-black" htmlFor="ingredientItem">
                  Raw Material
                </label>
                <select
                  onChange={handleIngredientChange}
                  value={ingredientForm.itemId}
                  name="itemId"
                  id="ingredientItem"
                  className="formInput"
                >
                  <option value="" disabled>
                    Select ingredient
                  </option>
                  {availableItems.map((item) => (
                    <option key={item.itemId} value={item.itemId}>
                      {item.itemName} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="form-label-black" htmlFor="usedStock">
                  Quantity
                </label>
                <input
                  onChange={handleIngredientChange}
                  value={ingredientForm.usedStock}
                  name="usedStock"
                  id="usedStock"
                  type="number"
                  min="0"
                  step="0.01"
                  className="formInput"
                />
              </div>

              {/* Add Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Ingredient
                </button>
              </div>
              {ingError && <p className="text-sm text-red-500">{ingError}</p>}
              {errors.ingredients && (
                <p className="text-sm text-red-500">{errors.ingredients}</p>
              )}
            </div>

            {/* Ingredients List */}
            {formInput.ingredients.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Added Ingredients</h3>
                <ul className="divide-y divide-gray-200">
                  {formInput.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">
                          {index + 1} {ingredient.itemName}
                        </span>
                        <span className="ml-2 text-gray-400">
                          {ingredient.usedStock} {ingredient.stockUnit}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* sellingPrice */}
          <div className="mt-4 ">
            <label className="form-label-black" htmlFor="sellingPrice">
              sellingPrice
            </label>
            <input
              onChange={handleInputChange}
              value={formInput.sellingPrice}
              name="sellingPrice"
              id="sellingPrice"
              type="number"
              className="formInput w-full border-2 border-black"
            />
            {errors.sellingPrice && (
              <p className="text-sm text-red-500">{errors.sellingPrice}</p>
            )}
          </div>
          {/* Cost Summary */}
          <div className="mt-8 p-4 bg-green-900 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Cost Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-200">Total Cost:</p>
                <p className="font-medium">₹{formInput.costPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-green-200">With GST ({formInput.gst}%):</p>
                <p className="font-medium">
                  ₹
                  {(formInput.costPrice * (1 + formInput.gst / 100)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-green-200">Suggested Price (30% margin):</p>
                <p className="font-medium">
                  ₹{(formInput.costPrice * 1.3).toFixed(2)} per {formInput.unit}
                </p>
              </div>
              <div>
                <p className="text-green-200">selling Price</p>
                <p className="font-medium">₹{formInput.sellingPrice}</p>
              </div>
              <div>
                <p className="text-green-200">selling profit</p>
                <p className="font-medium">
                  ₹
                  {formInput.sellingPrice -
                    (formInput.costPrice * (1 + formInput.gst / 100)).toFixed(
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
              onClick={saveRecipe}
              className="px-8 py-3 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Save Recipe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddRecipiesForm;
