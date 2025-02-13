const express= require('express')
const cors = require('cors')
const connectDb = require('./db')
const config = require('./config.json')
const app = express()

 //Middlewares
app.use(cors())

// Connect to MongoDB
connectDb(config.MongoDB_URL)

// route Files
const workerRouter = require('./routes/workers')

//endpoints routes
app.use("/api/w1",workerRouter)

//Server Start up
app.listen(3000,()=>{
    console.log(config.MongoDB_URL);
    
    console.log('Server is running on port 3000')
})



