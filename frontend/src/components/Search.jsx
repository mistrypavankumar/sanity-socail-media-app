import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";
import { feedQuery, searchQuery } from "../utils/data";
import { client } from "../client";

const Search = ({ searchItem }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchItem !== "") {
      setLoading(true);

      const query = searchQuery(searchItem.toLowerCase());

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchItem]);

  return (
    <div>
      {loading && <Spinner />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length !== 0 && searchItem !== "" && !loading && (
        <div className="mt-10 text-center text-xl text-gray-400">
          <p>No Pins are Found!</p>
        </div>
      )}
    </div>
  );
};

export default Search;
