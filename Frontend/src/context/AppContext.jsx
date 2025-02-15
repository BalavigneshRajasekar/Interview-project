/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppHandler = ({ children }) => {
  const [Collections, setCollections] = useState([]); //contains all the collections
  const [emptyData, setEmptyData] = useState(false); // if the collection is empty
  const [status, setStatus] = useState([]); // status name and the count
  const [statusData, setStatusData] = useState([]); // particular status data

  useEffect(() => {
    fetchCollections();
  }, []);
  //Get Collection names From Backend to proceed Further
  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/w1/get-collections"
      );
      setCollections(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Get all status by Count
  const fetchStatuses = async (collectionName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/w1/get-statusCounts/${collectionName}`
      );
      if (response.data.statusCounts.length == 0) {
        //Check We got an empty array or what
        setEmptyData(true);
      }
      setStatus(response.data.statusCounts);
    } catch (error) {
      console.error(error);
    }
  };

  // Get data based on status
  const fetchDataByStatus = async (collections, statusName) => {
    console.log(statusName, collections);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/w1/get-jobs/${collections}`,
        {
          params: { statusName },
        }
      );
      console.log(response);
      setStatusData(response.data.jobs);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };
  return (
    <AppContext.Provider
      value={{
        Collections,
        fetchStatuses,
        setEmptyData,
        status,
        setStatus,
        emptyData,
        fetchDataByStatus,
        statusData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppHandler;
