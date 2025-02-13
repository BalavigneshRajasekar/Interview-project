const express= require('express')
const cors = require('cors')
const connectDb = require('./db')
require('dotenv').config()

const config = require('./config.json')
const app = express()

 //Middlewares
app.use(cors())

// Connect to MongoDB
connectDb(process.env.MongoDB_URL)

// route Files
const workerRouter = require('./routes/workers')

//endpoints routes
app.use("/api/w1",workerRouter)

//Server Start up
app.listen(3000,()=>{    
    console.log('Server is running on port 3000')
})



