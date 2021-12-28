import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";

const CreatePin = ({ user }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const textFieldStyles =
    "outline-none text-base sm:text-lg bg-transparent border-b-2 border-gray-500 p-2 text-gray-400";

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];

    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff" ||
      selectedFile.type === "jpg"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((err) => {
          console.log("upload failed: ", err.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      // creating a pin
      client.create(doc).then(() => {
        navigate("/", { replace: true });
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="bg-red-200 px-5 py-2 rounded-lg text-red-500 text-xl mb-5 transition-all duration-150 ease-in">
          Please add all fields
        </p>
      )}

      <div className="flex lg:flex-row flex-col justify-center items-center bg-secondaryColor rounded-lg lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor2 rounded-lg p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 rounded-lg border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}{" "}
            {wrongImageType && (
              <p className="text-gray-500">It&apos;s wrong file type...</p>
            )}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-4xl text-gray-500">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-gray-500 text-lg">Click to upload</p>
                  </div>

                  <p className="mt-5 text-gray-400 text-center">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF,
                    or TIFF less than 20MB
                  </p>
                </div>

                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full rounded-lg "
                />

                <button
                  className="absolute bottom-0 right-0 p-3 bg-white rounded-tl-lg rounded-br-lg text-xl cursor-pointer text-red-500 outline-none hover:shadow-md transition-all duration-500 ease-in-out opacity-75 hover:opacity-100"
                  onClick={() => {
                    setImageAsset(null);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 bg-transparent border-gray-500 text-gray-400 p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-secondaryColor2 rounded-lg">
              <img
                src={user?.image}
                alt="user-img"
                className="w-10 h-10 rounded-lg shadow-lg"
              />
              <p className="font-bold text-gray-400">{user?.userName}</p>
            </div>
          )}

          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin si about..."
            className={textFieldStyles}
          />

          <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className={textFieldStyles}
          />

          <div className="flex flex-col">
            <div>
              <p className="mb-2 text-gray-400 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 bg-secondaryColor2 text-gray-400 border-b-0 text-base shadow-lg border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option
                  value="others"
                  className="sm:text-lg bg-secondaryColor2"
                >
                  Select Category
                </option>
                {categories.map((item) => {
                  return (
                    <option
                      key={item.name}
                      className="text-base border-0 outline-none capitalize bg-secondaryColor2 text-gray-500"
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button onClick={savePin} className="blueBtnWithScaleEffect">
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
