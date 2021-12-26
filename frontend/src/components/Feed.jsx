import React, { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import { useParams } from "react-router-dom";
import { feedQuery, searchQuery } from "../utils/data";
import { client } from "./../client";
import Spinner from "./Spinner";

const Feed = () => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);

      //   fetching the data
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);

      // fetching the data
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  const ideaName = categoryId || "new";

  if (loading) {
    return (
      <div className="w-full h-56">
        <Spinner message={`We are adding ${ideaName} ideas to your feed`} />
      </div>
    );
  }
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
