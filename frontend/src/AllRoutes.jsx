import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import CreateContact from './components/CreateContact'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/createContact' element={<CreateContact/>}/>
    </Routes>
  )
}

export default AllRoutes