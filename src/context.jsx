import React, { createContext, useContext, useState, useEffect } from "react";

export const Context = createContext();

export function GlobalProvider({ children }) {
  const [rawMaterials, setRawMaterials] = useState([
    {
      id: "2",
      itemName: "coconut oil",
      availableStock: 0,
      minimumStock: 10,
      maximumStock: 30,
      unit: "ltr",
      category: "oils",
      pricePerUnit: "60",
      modifiedDate: "27-5-25",
      // totalPrice:"100",
      gst: 8,
      img: "https://oleofats.com/wp-content/uploads/2024/04/coconut-oil.jpg",
    },
    {
      id: "3",
      itemName: "coconuts",
      availableStock: 0,
      minimumStock: 10,
      maximumStock: 30,
      unit: "pieces",
      category: "other",
      pricePerUnit: "30",
      modifiedDate: "26-5-25",
      // totalPrice:"100",
      gst: 7,
    },
    {
      id: "4",
      itemName: "chicken",
      availableStock: 10,
      minimumStock: 5,
      maximumStock: 20,
      unit: "kgs",
      category: "meat",
      pricePerUnit: "400",
      modifiedDate: "25-5-25",
      // totalPrice:"100",
      gst: 4,
    },
    {
      id: "145558721",
      itemName: "sugar",
      availableStock: 50,
      minimumStock: 10,
      maximumStock: 100,
      unit: "kg",
      category: "pantry",
      pricePerUnit: 40, // ₹40 per kg
      gst: 5,
      img: "https://example.com/sugar.jpg",
    },
    {
      id: "547862",
      itemName: "milk",
      availableStock: 30,
      minimumStock: 5,
      maximumStock: 50,
      unit: "ltr",
      category: "dairy",
      pricePerUnit: 60, // ₹60 per liter
      gst: 5,
      img: "https://example.com/milk.jpg",
    },
    {
      id: "789123",
      itemName: "tea leaves",
      availableStock: 5,
      minimumStock: 2,
      maximumStock: 20,
      unit: "kg",
      category: "pantry",
      pricePerUnit: 500, // ₹500 per kg
      gst: 12,
      img: "https://example.com/tea-leaves.jpg",
    },
    {
      id: "456789",
      itemName: "water",
      availableStock: 1000,
      minimumStock: 100,
      maximumStock: 2000,
      unit: "ltr",
      category: "utility",
      pricePerUnit: 0.5, // ₹0.5 per liter (filtered water)
      gst: 0,
      img: "https://example.com/water.jpg",
    },
  ]);
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "12546",
      itemId: "1",
      itemName: "coconut oil",
      category: "oil",
      purchasedStock: 20,
      unit: "ltr",
      purchasedDate: "30-5-25",
      img: "https://oleofats.com/wp-content/uploads/2024/04/coconut-oil.jpg",
      totalPrice: 400,
      pricePerUnit: 20,
      gst: 5.4,
    },
    {
      id: "12466",
      itemId: "2",
      itemName: "tomato",
      category: "vegetable",
      purchasedStock: 22,
      unit: "kg",
      pricePerUnit: 20,
      purchasedDate: "30-5-25",
      img: "https://source.washu.edu/app/uploads/2015/11/Tomato250-1.jpg",
      totalPrice: 400,
      gst: 5,
    },
  ]);
  const [recipes, setRecipes] = useState([
    {
      id: "1343132",
      name: "Tea",
      category: "Beverage",
      unit: "cup",
      pricePerUnit: 20,
      gst: 5,
      costPrice: 4.75,
      sellingPrice: 20,
      ingredients: [
        {
          itemId: "789123", // tea leaves
          itemName: "tea leaves",
          usedStock: 0.005, // 5g per cup
          stockUnit: "kg",
          price: 2.5, // (0.005kg * ₹500/kg)
        },
        {
          itemId: "145558721", // sugar
          itemName: "sugar",
          usedStock: 0.01, // 10g per cup
          stockUnit: "kg",
          price: 0.4, // (0.01kg * ₹40/kg)
        },
        {
          itemId: "547862", // milk
          itemName: "milk",
          usedStock: 0.05, // 50ml per cup
          stockUnit: "ltr",
          price: 3.0, // (0.05ltr * ₹60/ltr)
        },
        {
          itemId: "456789", // water
          itemName: "water",
          usedStock: 0.15, // 150ml per cup
          stockUnit: "ltr",
          price: 0.075, // (0.15ltr * ₹0.5/ltr)
        },
      ],
    },
    {
      id: "2456891",
      name: "Black Coffee",
      category: "Beverage",
      unit: "cup",
      pricePerUnit: 15,
      gst: 5,
      costPrice: 3.25,
      sellingPrice: 15,
      ingredients: [
        {
          itemId: "789456", // coffee powder
          itemName: "coffee powder",
          usedStock: 0.01,
          stockUnit: "kg",
          price: 3.0,
        },
        {
          itemId: "145558721", // sugar
          itemName: "sugar",
          usedStock: 0.01,
          stockUnit: "kg",
          price: 0.4,
        },
        {
          itemId: "456789", // water
          itemName: "water",
          usedStock: 0.15,
          stockUnit: "ltr",
          price: 0.075,
        },
      ],
    },
    {
      id: "3567824",
      name: "Masala Chai",
      category: "Beverage",
      unit: "cup",
      pricePerUnit: 25,
      gst: 5,
      costPrice: 6.5,
      sellingPrice: 25,
      ingredients: [
        {
          itemId: "789123", // tea leaves
          itemName: "tea leaves",
          usedStock: 0.005,
          stockUnit: "kg",
          price: 2.5,
        },
        {
          itemId: "145558721", // sugar
          itemName: "sugar",
          usedStock: 0.01,
          stockUnit: "kg",
          price: 0.4,
        },
        {
          itemId: "547862", // milk
          itemName: "milk",
          usedStock: 0.1, // 100ml for masala chai
          stockUnit: "ltr",
          price: 6.0,
        },
        {
          itemId: "456789", // water
          itemName: "water",
          usedStock: 0.1,
          stockUnit: "ltr",
          price: 0.05,
        },
        {
          itemId: "123456", // masala powder
          itemName: "masala powder",
          usedStock: 0.002,
          stockUnit: "kg",
          price: 1.0,
        },
      ],
    },
  ]);
  const [salesData, setSalesData] = useState([]);

  // useEffect(() => {
  //   console.log(purchaseOrders);
  // }, [purchaseOrders]);

  const getColor = (availableStock, minimumStock) => {
    if (availableStock <= minimumStock) {
      return ["red", "out of stock"];
    } else if (availableStock >= Math.floor(minimumStock * 1.75)) {
      return ["green", "available"];
    } else if (availableStock >= Math.floor(minimumStock * 1.5)) {
      return ["yellow", "low stock"];
    }
  };

  return (
    <Context.Provider
      value={{
        rawMaterials,
        setRawMaterials,
        purchaseOrders,
        setPurchaseOrders,
        getColor,
        salesData,
        setSalesData,
        recipes,
        setRecipes,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(Context);
};
