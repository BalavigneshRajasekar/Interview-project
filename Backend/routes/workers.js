const express = require('express')
const createWorkerModel = require('../models/DynamicWorker')
 const config = require('../config.json')
const mongoose = require('mongoose')
const app = express()

//dummy workers
const workers = [
    
      {data:{nams:"transactions",},Type: "Transaction", status: "active", time:Date.now() },
      {data:{nams:"money",},Type: "Transaction", status: "completed", time:Date.now() },
      {data:{nams:"outstanding",},Type: "Transaction", status: "failed", time:Date.now() },
      {data:{nams:"pending amount",},Type: "Transaction", time:Date.now() },
      {data:{nams:"profit amount",},Type: "Transaction",  time:Date.now() },
      {data:{nams:"loss amount",},Type: "Transaction",  time:Date.now() },
      {data:{nams:"tax amount",},Type: "Transaction", status: "active", time:Date.now() },
      {data:{nams:"invest",},Type: "Transaction", status: "active", time:Date.now() },
   
   
  ];

// API to create a task in Doers collection
app.post("/add-worker/:collectionName", async (req, res) => {
    try {
      const { collectionName } = req.params;
    //   const { name, jobs } = req.body;
  
      const WorkerModel = createWorkerModel(collectionName);
      await WorkerModel.deleteMany()
      await WorkerModel.insertMany(workers)
    
     
      res.status(201).json({ message: "Worker added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  // API to get status count from specific collection
app.get("/get-statusCounts/:collectionName", async (req, res) => {
     const { collectionName } = req.params
    // const { page, limit } = req.query;
    try {
     
      const WorkerModel = createWorkerModel(collectionName);
      const statusCounts = await WorkerModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
  
      res.json({ statusCounts });
    
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // API to serve Collection name to front end for further process
  app.get("/get-collections", async (req, res) => {
    try {
      const collections = config.Collections
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // API to get particular workers form particular collection
  app.get("/get-worker/:collectionName/:workerId", async (req, res) => {
    try {
      const { collectionName, workerId } = req.params;
      const WorkerModel = createWorkerModel(collectionName);
  
      const worker = await WorkerModel.findById(workerId);
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
  
      res.status(200).json({ worker });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//get jobs by status 
app.get("/get-jobs/:collectionName", async (req, res) => {
    try {
      const { collectionName } = req.params;
      const { status } = req.query; // Get status from query params
  
      const WorkerModel = createWorkerModel(collectionName);
  
      const jobs = await WorkerModel.aggregate([
        { $match: { status: status } }, // Match only jobs with the requested status
       
      ]);
  
      res.status(200).json({ jobs: jobs.map(j => j.job) }); // Return job array
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  //endpoint to get particular works job status filter
  app.get("/get-job/:collectionName/:workerId", async (req, res) => {
    const {status}=req.query
    console.log(status);
    
    try {
      const { collectionName, workerId } = req.params;
      const WorkerModel = createWorkerModel(collectionName);
  
      const worker = await WorkerModel.findById(workerId);
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
  
      const job = worker.job.filter(j => j.status === status);

      if (!job) {
        return res.status(404).json({ message: "Job not found for this worker" });
      }
      
      res.status(200).json({ job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = app;


