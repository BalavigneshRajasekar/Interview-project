/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppHandler = ({ children }) => {
  const [Collections, setCollections] = useState([]);
  const [emptyData, setEmptyData] = useState(false);
  const [status, setStatus] = useState([]);

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
  return (
    <AppContext.Provider
      value={{
        Collections,
        fetchStatuses,
        setEmptyData,
        status,
        emptyData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppHandler;
