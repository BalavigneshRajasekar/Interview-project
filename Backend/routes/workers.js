const express = require("express");
const { createWorkerModel } = require("../models/DynamicWorker");
const config = require("../config.json");
const mongoose = require("mongoose");
const app = express();

// API to create a task in Doers collection
app.post("/add-worker/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { TaskName, TaskDescription, Type, status } = req.body;

    //Format data structure
    let workersData = {
      data: {
        TaskName: TaskName,
        TaskDescription: TaskDescription,
      },
      Type: Type,
      status: status,
    };
    const WorkerModel = createWorkerModel(collectionName);

    if (req.body.length == undefined) {
      //Insert Single Data
      await WorkerModel.insertOne(workersData);
    } else {
      // Insert Multiple Data
      console.log(req.body);

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
    if (collections == undefined) {
      throw new Error("Collections not found in config.json");
    }
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get jobs by status
app.get("/get-jobs/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { statusName, pageNo, limit } = req.query; // Get status from query params
    if (!pageNo || !limit) {
      res.status(404).json({ error: "page number and limit are required" });
    }
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
    const deleteIds = ids.map((value) => value._id); //extract id from the array of object

    const WorkerModel = createWorkerModel(collectionName);

    await WorkerModel.deleteMany({ _id: { $in: deleteIds } });
    res.status(200).json({ message: "Jobs deleted successfully" }); // Return success message
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
