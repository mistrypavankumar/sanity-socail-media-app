import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  // fetching pin details
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
        console.log(data);

        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);

          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-secondaryColor rounded-3xl overflow-hidden"
          style={{ maxWidth: "1500p" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-3xl"
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-end mb-3">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                className="blueBtnWithSlideText group"
              >
                <MdDownloadForOffline fontSize={21} className="text-white" />
                <p className="hidden md:group-hover:block translate-x-10 group-hover:translate-x-0 text-bold text-white">
                  Download
                </p>
              </a>
            </div>
            <a
              className="text-primaryBlue"
              href={pinDetail.destination}
              target="_blank"
              rel="noreferrer"
            >
              {pinDetail.destination?.slice(8)}
            </a>
            <div>
              <h1 className="text-4xl fond-blod text-gray-300 break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="text-gray-500 mt-3">{pinDetail.about}</p>
            </div>

            <Link
              to={`/user-profile/${pinDetail?.postedBy._id}`}
              className="flex gap-2 mt-7 mb-2 items-center bg-secondaryColor2 rounded-lg shadow-lg outline-none"
            >
              <img
                src={pinDetail?.postedBy?.image}
                className="w-10 h-10 rounded-lg"
                alt="user-profile"
              />
              <p className="text-gray-400 text-2xl flex items-center">
                {pinDetail?.postedBy?.userName}
              </p>
            </Link>

            <h2 className="mt-5 text-2xl text-gray-300">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => {
                return (
                  <div
                    key={item.comment}
                    className="flex gap-2 mt-5 items-center bg-secondaryColor2 rounded-lg "
                  >
                    <img
                      src={item.postedBy?.image}
                      alt="postedByImage"
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />

                    <div className="flex flex-col">
                      <p className="font-bold text-gray-300">
                        {item.postedBy?.userName}
                      </p>
                      <p className="text-gray-400">{item.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-lg cursor-pointer"
                  alt="postedByImage"
                />
              </Link>

              <input
                className="flex-1 border-2 border-gray-600 focus:border-borderBlue bg-transparent text-gray-300 outline-none rounded-lg px-2"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                type="button"
                onClick={addComment}
                className="blueBtnWithScaleEffect"
              >
                {addingComment ? "Commenting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pins?.length > 0 && (
        <h2 className="text-center text-gray-300 font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  );
};

export default PinDetail;
