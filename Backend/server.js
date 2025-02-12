const express= require('express')
const cors = require(('cors'))
const app = express()

const userRouter = require('./routes/user')
 //Middlewares
app.use(cors())

app.use("/api/v1",userRouter)

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})
