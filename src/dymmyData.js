import { useState } from "react";

export const toSavePercentage = 30;
export const unixDay = 86400;
export const unixWeek = unixDay * 7;
export const unixMonth = unixDay * 30;
useState;

export const expenseData = [
  {
    id: "exp_1a2b8c",
    amount: 50,
    title: "tomato",
    category: "food",
    timestamp: Math.floor(Date.now() / 1000), // Feb 1, 2025 (Thursday)
  },
  {
    id: "exp_1a2b3c",
    amount: 350,
    title: "Groceries",
    category: "food",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 4, // Feb 1, 2025 (Thursday)
  },
  {
    id: "exp_4d5e6f",
    amount: 120,
    title: "Lunch with colleagues",
    category: "food",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 7, // +1 day (Feb 2)
  },
  {
    id: "exp_7g8h9i",
    amount: 600,
    title: "Weekend getaway",
    category: "travel",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 10, // Feb 3 (Saturday)
  },
  // Gap Feb 4-5 (no entries)
  {
    id: "exp_j1k2l3",
    amount: 80,
    title: "Coffee meetings",
    category: "food",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 18, // Feb 6 (Tuesday)
  },
  {
    id: "exp_m4n5o6",
    amount: 200,
    title: "Fuel",
    category: "transport",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 24, // Feb 7
  },
  {
    id: "exp_p7q8r9",
    amount: 450,
    title: "Movie night",
    category: "entertainment",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 34, // Feb 8 (Saturday)
  },
  // Gap Feb 9-11
  {
    id: "exp_s1t2u3",
    amount: 300,
    title: "Gym membership",
    category: "health",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 54, // Feb 12 (Wednesday)
  },
  {
    id: "exp_v4w5x6",
    amount: 150,
    title: "Book purchase",
    category: "education",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 60, // Feb 13
  },
  // Gap Feb 14-16
  {
    id: "exp_y7z8a9",
    amount: 700,
    title: "Car service",
    category: "transport",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 74, // Feb 17 (Monday)
  },
  {
    id: "exp_b1c2d3",
    amount: 90,
    title: "Snacks",
    category: "food",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 84, // Feb 19
  },
  {
    id: "exp_e4f5g6",
    amount: 400,
    title: "Dinner date",
    category: "food",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 94, // Feb 21 (Friday)
  },
  // Gap Feb 22-24
  {
    id: "exp_h7i8j9",
    amount: 250,
    title: "Electric bill",
    category: "utilities",
    timestamp: Math.floor(Date.now() / 1000) - unixDay * 30, // Feb 25 (Tuesday)
  },
  {
    id: "exp_k1l2m3",
    amount: 180,
    title: "Uber rides",
    category: "transport",
    timestamp: 1740192000, // Feb 26
  },
];
export const incomeData = [
  {
    id: "inc_1a2b3c",
    amount: 25000,
    title: "Salary (Company)",
    category: "employment",
    timestamp: 1738368000, // Feb 1 (Payday)
  },
  {
    id: "inc_4d5e6f",
    amount: 3200,
    title: "Freelance Project",
    category: "side-hustle",
    timestamp: 1738540800, // Feb 3 (Weekend deposit)
  },
  {
    id: "inc_7g8h9i",
    amount: 1500,
    title: "Stock Dividends",
    category: "investment",
    timestamp: 1738800000, // Feb 6
  },
  {
    id: "inc_j1k2l3",
    amount: 800,
    title: "Blog Ad Revenue",
    category: "passive",
    timestamp: 1739068800,
  },
  {
    id: "inc_m4n5o6",
    amount: 5000,
    title: "Consulting Fee",
    category: "freelance",
    timestamp: 1739232000,
  },
  {
    id: "inc_p7q8r9",
    amount: 1200,
    title: "Rental Income",
    category: "property",
    timestamp: 1739491200,
  },
  {
    id: "inc_s1t2u3",
    amount: 750,
    title: "Cashback Rewards",
    category: "bonus",
    timestamp: 1739577600,
  },
  {
    id: "inc_v4w5x6",
    amount: 18000,
    title: "Side Business",
    category: "entrepreneurship",
    timestamp: 1740105600, // Feb 25 (Month-end payout)
  },
  // month
  {
    id: "inc_1a2b3c",
    amount: 25000,
    title: "Salary (Company)",
    category: "employment",
    timestamp: 1738368000 + unixDay * 30, // Feb 1 (Payday)
  },
  {
    id: "inc_1a2b3c",
    amount: 25000,
    title: "Salary (Company)",
    category: "employment",
    timestamp: 1738368000 + unixDay * 60, // Feb 1 (Payday)
  },
  {
    id: "inc_4d5e6f",
    amount: 3200,
    title: "Freelance Project",
    category: "side-hustle",
    timestamp: 1738540800 + unixDay * 40, // Feb 3 (Weekend deposit)
  },
  {
    id: "inc_7g8h9i",
    amount: 1500,
    title: "Stock Dividends",
    category: "investment",
    timestamp: 1738800000 + unixDay * 50, // Feb 6
  },
  {
    id: "inc_7g8h1i",
    amount: 15000,
    title: "Stock Dividends",
    category: "investment",
    timestamp: 1738800000 + unixDay * 90, // Feb 6
  },
  {
    id: "inc_j1k2l3",
    amount: 800,
    title: "Blog Ad Revenue",
    category: "passive",
    timestamp: 1739068800 + unixDay * 80,
  },

  // month
];
