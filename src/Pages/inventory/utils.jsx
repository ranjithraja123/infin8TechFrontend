export const getTotalPrice = (pricePerUnit, purchasedStock, gst) => {
  const price = (pricePerUnit * purchasedStock).toFixed(1);
  const tax = (price * (gst / 100)).toFixed(1);
  const total = (+price + +tax).toFixed(1);

  return {
    price,
    tax,
    total,
  };
};
