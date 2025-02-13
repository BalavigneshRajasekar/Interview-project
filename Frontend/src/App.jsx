
/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import AppHandler from './context/AppContext';
import Workers from './components/Workers';
import JobStatus from './components/JobStatus';


function App() {

  return (
    <>   
    <AppHandler>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}> </Route>
      <Route path='/workers' element={<Workers/>}></Route>
      <Route path='/jobStatus/:id' element={<JobStatus/>}></Route>
    </Routes>
    </BrowserRouter>
    </AppHandler>   
    </>
  )
}

export default App
