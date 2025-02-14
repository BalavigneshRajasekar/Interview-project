/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import { Badge, Button, Empty } from "antd";

function QueueStatus() {
  const { collections } = useParams();
  const navigate = useNavigate();
  const { fetchStatuses, status, emptyData, setEmptyData } =
    useContext(AppContext);

  useEffect(() => {
    fetchStatuses(collections); // Fetch the statuses from the selected collection
    // Add cleanup function here to stop the fetch when component unmounts
    console.log(status);

    return () => {
      // Add cleanup code here
      setEmptyData(false);
    };
  }, []);
  const handleChange = (id) => {
    navigate(`/${collections}/${id}`); // Navigate to workers page with selected status
  };
  return (
    <div>
      <h1 className="text-center bg-green-600">{collections}</h1>
      <Button className="mt-5" onClick={() => navigate("/")}>
        Go back
      </Button>
      {emptyData ? (
        <Empty></Empty>
      ) : (
        <div className="flex justify-center">
          {status.length > 0 ? (
            <div className="flex h-100 justify-center items-center gap-10 border p-5 rounded-3xl mt-4 flex-wrap">
              {status.map((stat, i) => (
                <Badge
                  key={i}
                  count={stat.count}
                  className="active:scale-90 transition 1s ease-in-out"
                >
                  <button
                    className=" bg-blue-400 rounded font-bold p-10"
                    onClick={() => handleChange(stat._id)} //contains particular status
                  >
                    {stat._id}
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p>Loading</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QueueStatus;
