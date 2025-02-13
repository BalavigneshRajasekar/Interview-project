/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { Button} from'antd'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router';
function Home() {
    const collections = ["DoerQueue", "otherCollections"];
    const navigate = useNavigate()
    const {setSelectedCollection,selectedCollection}=useContext(AppContext)
    console.log(selectedCollection);
    
    const handleChangeCollection =(collection)=>{
        setSelectedCollection(collection);
        navigate(`/workers`)

    }
  return (
    <>
      <h1 className='text-center'>Welcome to Home Page</h1>
      <div className='flex justify-center gap-5'>
        {collections.map((collection, index)=>(
          <Button key={index} onClick={()=>handleChangeCollection(collection)} className='p-3'>
            {collection}
          </Button>
        ))}
      </div>
     
    
    
    
   </>
  )
}

export default Home
