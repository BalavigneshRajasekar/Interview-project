/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import { Badge, Button, Empty, message } from "antd";
import { FaRegPlusSquare } from "react-icons/fa";
import FormModel from "./FormModel";
import axios from "axios";

function QueueStatus() {
  const { collections } = useParams();
  const [open, setOpen] = useState(); // to open Form model to add new job
  const navigate = useNavigate();
  const { fetchStatuses, status, setStatus, emptyData, setEmptyData } =
    useContext(AppContext);

  useEffect(() => {
    fetchStatuses(collections); // Fetch the statuses from the selected collection
    // Add cleanup function here to stop the fetch when component unmounts
    console.log(status);

    return () => {
      // Add cleanup code here
      setEmptyData(false);
      setStatus([]);
    };
  }, []);
  const handleChange = (id) => {
    navigate(`/${collections}/${id}`); // Navigate to workers page with selected status
  };

  // Onsubmit Add the New Task to Particular Collections
  const onSubmit = async (values) => {
    setOpen(false);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/w1/add-worker/${collections}`,
        values
      );
      message.success("Added");
      fetchStatuses(collections); // Fetch the statuses once again when new task added
      console.log(response);
    } catch (e) {
      console.error("Error occurred while adding new task", e);
    }
  };

  return (
    <div>
      <h1 className="text-center bg-green-600">{collections}</h1>
      <Button className="mt-5" onClick={() => navigate("/")}>
        Go back
      </Button>
      <div className="flex justify-center">
        <Button icon={<FaRegPlusSquare />} onClick={() => setOpen(true)}>
          Add NewTask
        </Button>
      </div>
      <FormModel open={open} onSubmit={onSubmit} setOpen={setOpen}></FormModel>
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
