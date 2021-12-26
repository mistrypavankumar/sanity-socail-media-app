/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client, urlFor } from "../client";
import { MdDownloadForOffline } from "react-icons/md";

const Pin = ({ pin }) => {
  const { postedBy, image, _id, destination } = pin;

  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const user =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user_post"
          src={urlFor(image).width(250).url()}
        />

        {postHovered && (
          <div
            className="absolute top-0 w-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
