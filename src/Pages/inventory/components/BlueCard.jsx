import React from "react";
import { Link } from "react-router-dom";
Link;
const BlueCard = ({ title, to }) => {
  return (
    <Link
      to={to}
      className="primaryBG relative  col-span-12 flex cursor-pointer flex-col overflow-hidden rounded-xl px-4 pt-12 pb-4  transition-all duration-300 ease-in-out hover:scale-102 md:col-span-6 lg:col-span-4 2xl:col-span-3 shadow-2xl shadow-green-900  bg-gradient-to-r from-black via-grey-200 to-green-800"
    >
      <img
        src="/card-dots.png"
        className="absolute top-[-100px] left-0 z-5 w-[300px]"
        alt=""
      />
      <div className="z-6 mt-8 flex flex-col">
        <h1 className="text-xl font-semibold text-white capitalize">{title}</h1>
      </div>
    </Link>
  );
};

export default BlueCard;
