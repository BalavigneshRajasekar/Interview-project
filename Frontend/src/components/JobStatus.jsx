/* eslint-disable no-unused-vars */
import { Button } from 'antd'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../context/AppContext'

function JobStatus() {
    //Show to below Table
    const [selectedJob,setSelectedJob]=useState(null)
    const[show , setShow]= useState(false)
    const {fetchWorkerJob,job,filter,setFilter,selectedCollection}= useContext(AppContext)
    const {id}=useParams()

    useEffect(()=>{
 fetchWorkerJob(id) //This function get the particular workers job by ID
    },[])
   
    const filters=(status)=>{
        setShow(true)// load the table once click on any status
        getFilterByStatus(status)
    }
    const getFilterByStatus=async(status)=>{
     try{
const response= await axios.get(`http://localhost:3000/api/w1/get-job/${selectedCollection}/${id}/?status=${status}`)
 console.log(response.data.job);
 setFilter(response.data.job) //Update the filter state with the filtered jobs
 
     }catch(e){
        console.log(e);
        
     }
    }
  return (
    <div>
      <h1 className='text-center'>Job status</h1>

      <div className='flex justify-center gap-4'>
        {["waiting","active","completed","failed"].map((status,i)=>(
            <Button key={i} onClick={()=>filters(status)}>{status}</Button>
        ))}
      </div>
     


     {show && 
     <div style={{width:"100%"}}>
      {filter.length>0 ?
      <div style={{ padding: "20px" }}>
     
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Job Type</th>
          </tr>
        </thead>
        <tbody>
          {filter.map((job) => (
           <>
            <tr className='text-center'
              key={job._id}
              onClick={() => setSelectedJob(job)} // Update state with clicked job
              style={{ cursor: "pointer", backgroundColor: selectedJob?._id === job._id ? "#d3d3d3" : "white" }}
            >
              <td>{job._id}</td>
              <td>{job.Type}</td>
            </tr>
            {selectedJob?._id==job._id &&<div style={{ marginTop: "20px" }}>
          <h3>Selected Job Details</h3>
          <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(selectedJob, null, 2)}
          </pre>
        </div>}
           </>
          ))}
          
        </tbody>
      </table>

      {/* Show Selected JSON
      {selectedJob && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Job Details</h3>
          <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(selectedJob, null, 2)}
          </pre>
        </div>
      )} */}
    </div>:<p className='text-center'>No data</p>} 
    </div>}



        
       </div>
       

   
  )
}

export default JobStatus
