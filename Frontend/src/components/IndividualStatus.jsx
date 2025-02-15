/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";

function IndividualStatus() {
  const { status, collections } = useParams();
  const navigate = useNavigate();
  const [fullDetails, setFullDetails] = useState(null);
  const { fetchDataByStatus, statusData, setStatusData } =
    useContext(AppContext);
  const [selectedRows, setSelectedRows] = useState([]); // holds the selected rows

  //Page nation details
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    //Check when currentPage greater then total page
    if (currentPage > totalPage) {
      setCurrentPage(1);
    }
    fetchDataByStatus(collections, status, currentPage, setTotalPage);

    return () => {
      // Add cleanup code here

      console.log("clean");

      setStatusData([]);
    };
  }, [currentPage, totalPage]);

  //Onchange the data when clicked check box
  const toggleRow = (row) => {
    setSelectedRows((prev) => {
      const exists = prev.find((r) => r._id === row._id);
      return exists ? prev.filter((r) => r._id !== row._id) : [...prev, row];
    });
  };
  // Checked Un checked
  const isRowSelected = (row) => selectedRows.some((r) => r._id === row._id);
  console.log(selectedRows);

  //Download the Json File
  const download = () => {
    const dataStr = JSON.stringify(selectedRows);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    console.log(dataBlob);

    saveAs(dataBlob, `${collections}_${status}.json`);
  };

  //Delete Jobs
  const deleteJobs = async () => {
    console.log("executed");

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/w1/delete-jobs/${collections}`,
        {
          data: { ids: selectedRows },
        }
      );
      console.log(response);
      setSelectedRows([]);
      fetchDataByStatus(collections, status, currentPage, setTotalPage);
    } catch (e) {
      console.log("Error deleting jobs", e);
    }
  };

  return (
    <div className="p-5">
      <Button className="" onClick={() => navigate(`/${collections}`)}>
        Go Back
      </Button>
      <div className="flex justify-around mt-10">
        <h2 className="text-2xl font-bold text-center">Status: {status}</h2>
        <div className="flex gap-3">
          <Button
            variant="filled"
            color="purple"
            onClick={download}
            disabled={selectedRows.length == 0}
            icon={<FaCloudDownloadAlt />}
          >
            Dump JSON
          </Button>
          <Button
            color="danger"
            variant="filled"
            icon={<MdAutoDelete />}
            disabled={selectedRows.length == 0}
            onClick={() => deleteJobs()}
          >
            Remove
          </Button>
          <Button
            icon={<IoIosArrowDropleftCircle />}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage == 1}
          >
            Prev
          </Button>
          <span>
            {currentPage}/{totalPage}
          </span>
          <Button
            iconPosition="end"
            icon={<IoIosArrowDroprightCircle />}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage == totalPage}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(e.target.checked ? statusData : [])
                  }
                  checked={selectedRows.length === statusData.length}
                />
              </th>
              <th className="px-6 py-3 text-left">Job ID</th>
              <th className="px-6 py-3 text-left">Type</th>
            </tr>
          </thead>
          {statusData.length > 0 ? (
            <tbody className="divide-y divide-gray-200">
              {statusData.map((row) => (
                <>
                  <tr
                    onClick={() =>
                      setFullDetails((prev) => {
                        return prev ? (prev._id == row._id ? null : row) : row;
                      })
                    }
                    key={row.id}
                    className={`hover:bg-gray-100 ${
                      isRowSelected(row) ? "bg-gray-200" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isRowSelected(row)}
                        onChange={() => toggleRow(row)}
                      />
                    </td>
                    <td className="px-6 py-4">{row._id}</td>
                    <td className="px-6 py-4">{row.Type}</td>
                  </tr>
                  {fullDetails && fullDetails._id == row._id && (
                    <tr className="ms-10 w-50">
                      <td colSpan={3}>
                        <pre
                          style={{
                            backgroundColor: "#f4f4f4",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          {JSON.stringify(fullDetails, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          ) : (
            <td colSpan={3} className="text-center">
              No Data
            </td>
          )}
        </table>
      </div>
    </div>
  );
}

export default IndividualStatus;
