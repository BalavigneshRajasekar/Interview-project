const mongoose = require('mongoose')

// Function to create a dynamic Worker model with embedded jobs
const createWorkerModel = (collectionName) => {
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName]; // Return existing model
      }
  const JobSchema = new mongoose.Schema({
    data:{type:Object},
    Type: { type: String, required: true },
    status: { type: String, enum: ["waiting", "active", "completed" ,"failed","delayed"], default: "waiting" },
    runAt: { type: Date, default: Date.now }
  });

  const WorkerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    job: { type: [JobSchema], required: true }
  }, { collection: collectionName });

  return mongoose.model(collectionName, WorkerSchema);
};

module.exports = createWorkerModel;

