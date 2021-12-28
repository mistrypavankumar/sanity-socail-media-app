import React, { useState, useEffect } from "react";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { GoogleLogout } from "react-google-login";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";

const activeBtnStyles =
  "bg-primaryBlue text-white font-bold p-2 rounded-lg w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary border-2 border-gray-600 mr-4 text-gray-500 font-bold p-2 rounded-lg w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  // logout method
  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-full h-370 2xl:h-510 shadow-lg object-cover rounded-b-2xl"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <div className="w-50 h-50 rounded-full bg-primaryBlue p-1 -mt-14 shadow-xl">
              <img
                className="rounded-full object-cover"
                src={user?.image}
                alt="user-profile"
              />
            </div>
            <h1 className="font-bold text-2xl text-gray-300 text-center md:text-3xl mt-3">
              {user?.userName}
            </h1>

            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === User?.googleId && (
                <GoogleLogout
                  clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                  render={(renderProps) => {
                    return (
                      <button
                        type="button"
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="bg-primaryBlue group w-10 h-10 md:hover:w-32 flex justify-around items-center  p-2 rounded-full cursor-pointer outline-none shadow-md overflow-hidden transition-all duration-300 logoutBtn"
                      >
                        <AiOutlineLogout className="text-white" fontSize={21} />
                        <p className="hidden md:group-hover:block text-bold text-white">
                          Logout
                        </p>
                      </button>
                    );
                  }}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>

          <div className="text-center mb-7 mt-3">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              } mr-5`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>

          {pins?.length === 0 && (
            <div className="flex justify-center text-gray-500 font-bold items-center w-full text-1xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
