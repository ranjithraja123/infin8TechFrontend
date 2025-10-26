import React from "react";

const Snippet = ({ title, color = "green" }) => {
  const colorMap = {
    green: "bg-[#F0FDF4] text-[#22C55E]",
    purple: "bg-purple-100 text-purple-900",
    red: "bg-red-100 text-red-900",
    yellow: "bg-yellow-100 text-yellow-900",
    // Add more colors as needed
  };

  const colorClass = colorMap[color];
  // const colorClass = `bg-${color}-100 text-${color}-900`;
  return (
    <span class={`w-fit rounded-full px-2 py-1 ${colorClass} apply-border`}>
      <p class="text-xs font-semibold capitalize">{title}</p>
    </span>
  );
};

export default Snippet;
