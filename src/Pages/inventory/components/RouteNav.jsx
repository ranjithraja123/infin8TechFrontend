import React from "react";

const RouteNav = ({ title }) => {
  return (
    <div className="flex w-full flex-row items-center justify-start gap-4 border-b border-solid border-[#00000026] px-8 py-3">
      <div>
        <h1 className="text-darkText text-xl font-normal capitalize">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default RouteNav;
