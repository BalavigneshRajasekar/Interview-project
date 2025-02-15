const express = require("express");
const createWorkerModel = require("../models/DynamicWorker");
const config = require("../config.json");
const mongoose = require("mongoose");
const app = express();

//dummy workers
const workers = [
  {
    data: { nams: "transactions" },
    Type: "Transaction",
    status: "active",
    time: Date.now(),
  },
  {
    data: { nams: "money" },
    Type: "Transaction",
    status: "completed",
    time: Date.now(),
  },
  {
    data: { nams: "outstanding" },
    Type: "Transaction",
    status: "failed",
    time: Date.now(),
  },
  { data: { nams: "pending amount" }, Type: "Transaction", time: Date.now() },
  { data: { nams: "profit amount" }, Type: "Transaction", time: Date.now() },
  { data: { nams: "loss amount" }, Type: "Transaction", time: Date.now() },
  {
    data: { nams: "tax amount" },
    Type: "Transaction",
    status: "active",
    time: Date.now(),
  },
  {
    data: { nams: "invest" },
    Type: "Transaction",
    status: "active",
    time: Date.now(),
  },
];

// API to create a task in Doers collection
app.post("/add-worker/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { TaskName, TaskDescription, Type, status } = req.body;

    console.log(req.body.length);

    //Format data structure
    let workersData = {
      data: {
        TaskName: TaskName,
        TaskDescription: TaskDescription,
      },
      Type: Type,
      status: status,
    };
    console.log(typeof workersData);
    const WorkerModel = createWorkerModel(collectionName);

    if (req.body.length == undefined) {
      //Insert Single Data
      await WorkerModel.insertMany(workersData);
    } else {
      // Insert Multiple Data
      await WorkerModel.insertMany(req.body);
    }

    res.status(201).json({ message: "Worker added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get status count from specific collection
app.get("/get-statusCounts/:collectionName", async (req, res) => {
  const { collectionName } = req.params;
  // const { page, limit } = req.query;
  try {
    const WorkerModel = createWorkerModel(collectionName);
    const statusCounts = await WorkerModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    res.json({ statusCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to serve Collection name to front end for further process
app.get("/get-collections", async (req, res) => {
  try {
    const collections = config.Collections;
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get jobs by status
app.get("/get-jobs/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { statusName, pageNo, limit } = req.query; // Get status from query params

    //Convert to number
    let page = parseInt(pageNo);
    let dataPerPage = parseInt(limit);
    let skip = (page - 1) * dataPerPage;

    const WorkerModel = createWorkerModel(collectionName);
    const totalData = await WorkerModel.aggregate([
      { $match: { status: statusName } }, // Match only jobs with the requested status
      {
        $facet: {
          // Create two data
          metaData: [{ $count: "total" }], // Total document in the status
          data: [{ $skip: skip }, { $limit: dataPerPage }], // date per page
        },
      },
    ]);
    console.log(totalData);

    const totalDocument = totalData[0]?.metaData[0]?.total || 0;

    const jobs = totalData[0]?.data;

    const totalPage = Math.ceil(totalDocument / dataPerPage);

    res.status(200).json({ jobs, totalPage }); // Return job array
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to delete single and multiple  Jobs in collections

app.delete("/delete-jobs/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { ids } = req.body; // Get delete data
    const deleteIds = ids.map((value) => value._id); //extract id from the array
    console.log(deleteIds);

    const WorkerModel = createWorkerModel(collectionName);

    await WorkerModel.deleteMany({ _id: { $in: deleteIds } });
    res.status(200).json({ message: "Jobs deleted successfully" }); // Return success message
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
