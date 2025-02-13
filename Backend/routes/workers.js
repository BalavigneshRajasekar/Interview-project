const express = require('express')
const createWorkerModel = require('../models/DynamicWorker')

const mongoose = require('mongoose')
const app = express()

//dummy workers
const workers = [
    {
      name: "Work 1",
      job: [
        { _id: new mongoose.Types.ObjectId(), data:{},Type: "activeTask", status: "active", time: new Date() },
        { _id: new mongoose.Types.ObjectId(), data :{},Type:"completedTask", status: "completed", time: new Date() },
        { _id: new mongoose.Types.ObjectId(), data :{},Type:"failed task", status: "failed", time: new Date()},
        { _id: new mongoose.Types.ObjectId(), data :{},Type:"Waiting Task", status: "waiting", time: new Date()}
      ]
    },
    {
      name: "Work 2",
      job: [
        { _id: new mongoose.Types.ObjectId(), data:{} ,Type:"waitingTask", status: "waiting", time: new Date() },
        { _id: new mongoose.Types.ObjectId(), data :{},Type:"completedTask", status: "completed", time: new Date() }
      ]
    },
    {
      name: "Work 3",
      job: [
        { _id: new mongoose.Types.ObjectId(), data:{},Type:"completedTask", status: "completed", time: new Date() },
        { _id: new mongoose.Types.ObjectId(), data :{},Type:"completedTask", status: "completed", time: new Date() }
      ]
    },
   
  ];

// API to create a worker with jobs
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

  
  // API to get all workers from a specific collection
app.get("/get-workers/:collectionName", async (req, res) => {
    // const { page, limit } = req.query;
    try {
      const { collectionName } = req.params;
      const WorkerModel = createWorkerModel(collectionName);
  
      const workers = await WorkerModel.find()
    //   .skip((page - 1) * limit) // Skip previous pages
    //   .limit(parseInt(limit)); 

      const totalWorkers = await WorkerModel.countDocuments(); 
      res.status(200).json({ 

        // currentPage: parseInt(page),
        // totalPages: Math.ceil(totalWorkers / limit),
        workers, });
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
        { $unwind: "$job" }, // Flatten the job array
        { $match: { "job.status": status } }, // Match only jobs with the requested status
        { 
          $project: { 
            _id: 0, 
            job: 1 
          } 
        } // Only return the job field
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


