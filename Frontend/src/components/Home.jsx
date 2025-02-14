/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router";
function Home() {
  // const collections = ["DoerQueue", "otherCollections"];
  const navigate = useNavigate();
  const { Collections } = useContext(AppContext);
  console.log(Collections);

  const navigateToQueue = (collection) => {
    navigate(`/${collection}`);
  };
  return (
    <>
      <div>
        <h1 className="text-center bg-green-500">Select Queue</h1>
        {Collections.length > 0 ? (
          <div className="flex justify-center gap-5 h-100 items-center flex-wrap ">
            {Collections.map((collection, index) => (
              <button
                key={index}
                className="p-10 bg-amber-400 rounded-3xl active:scale-90 transition 1s ease-in-out grow"
                onClick={() => navigateToQueue(collection)}
              >
                {collection}
              </button>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default Home;
