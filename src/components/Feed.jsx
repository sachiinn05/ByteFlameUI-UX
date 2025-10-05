import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    const getFeed = async () => {
      if (feed) return; // already have feed
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    getFeed();
  }, [dispatch, feed]); 

if (!feed || feed.length === 0) 
  return (
    <h1 className="text-2xl font-bold text-center text-gray-500 mt-10">
      No  new user found
    </h1>
  );


  return (
    <div className="flex justify-center mt-8">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
