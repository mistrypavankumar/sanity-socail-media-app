import React from "react";
import { Link, NavLink } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../assets/logo.png";
import { categories } from "../utils/data";
import { IoIosArrowForward } from "react-icons/io";

const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize outline-none ";
const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize outline-none";

const Sidebar = ({ closeToggle, user }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          onClick={handleCloseSidebar}
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center outline-none"
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col grap-5 outline-none">
          <NavLink
            to="/"
            onClick={handleCloseSidebar}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl outline-none">
            Dicover categories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => {
            return (
              <NavLink
                to={`/category/${category.name}`}
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
                key={category.name}
              >
                <div className="flex my-2">
                  <img
                    src={category.image}
                    className="w-8 h-8 rounded-full shadow-sm"
                    alt={category.name}
                  />
                  <p className="ml-2">{category.name}</p>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 bg-white items-center rounded-lg shadow-lg mx-3 hover:bg-pink-100 outline-none"
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-lg"
            alt="userimage"
          />
          <p className="px-2">{user.userName}</p>
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
