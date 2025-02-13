/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useState } from "react";

export const AppContext = createContext()


const AppHandler =({children})=>{
    const [selectedCollection, setSelectedCollection] = useState("DoerQueue");
    const [filter,setFilter]=useState([])
    const [job,setJob]=useState([])
    
    const[workers,setWorkers]=useState([])

  // Fetching workers data from the API using axios
    const fetchWorkers = async()=>{
        try{
            const response = await axios.get(`http://localhost:3000/api/w1/get-workers/${selectedCollection}`)
            setWorkers(response.data.workers)

        }catch(e){
console.log(e);

        }  
    }
    // Fetching particular worker job data from the API using axios
 const fetchWorkerJob=async(id)=>{
        
        try{
   const response= await axios.get(`http://localhost:3000/api/w1/get-worker/${selectedCollection}/${id}`)
  setJob(response.data.worker.job)
  setFilter(response.data.worker.job)
  console.log(response.data.worker.job);
  
        }catch(e){
            console.log(e);
            
        }
    }

return(
    <AppContext.Provider value={{selectedCollection,
    setSelectedCollection,
    workers,setWorkers,
    fetchWorkers,
    fetchWorkerJob
    ,job,setFilter,filter}}>
    {children}
    </AppContext.Provider>
 
)
}

export default AppHandler;