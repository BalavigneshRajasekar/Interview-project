const mongoose = require('mongoose')

// Function to create a dynamic Worker model with embedded jobs
const createWorkerModel = (collectionName) => {
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName]; // Return existing model
      }
  const JobSchema = new mongoose.Schema({
    data:{type:Object, required:true},
    Type: { type: String, required: true },
    status: { type: String, enum: ["waiting", "active", "completed" ,"failed","delayed"], default: "waiting" },
    runAt: { type: Date, default: Date.now }
  },{ collection: collectionName });

  

  return mongoose.model(collectionName, JobSchema);
};

module.exports = createWorkerModel;

