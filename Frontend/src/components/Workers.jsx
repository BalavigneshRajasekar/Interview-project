/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { Button } from 'antd'
import { useNavigate } from 'react-router'

function Workers() {
    const navigate = useNavigate()
    const {selectedCollection,fetchWorkers,workers} =useContext(AppContext)

    useEffect(()=>{
        fetchWorkers() // Fetch the Workers from the selected collection

    },[selectedCollection])
    
  
    //Navigate to next page to show the job based on status
    const handleWorkers=(worker)=>{
        navigate(`/jobStatus/${worker._id}`)       
    }
  return (
    <div>
      <h1 className='text-center'>workers</h1>
      
      {workers.length>0?
      <div className='flex justify-center gap-5'>
       {workers && workers.map(worker=>(
          <Button key={worker._id} onClick={()=>{handleWorkers(worker)}}>{worker.name}</Button>
      ))}
      </div>
:<p className='text-center available'>No workers</p>}
    </div>
  )
}

export default Workers
