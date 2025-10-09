import React from 'react'
import Navbar from './components/Navigation/Navbar'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className=' w-full h-auto'>
      <Navbar />


      <div className='mt-[5rem] w-full h-[100%]'>
        <Outlet />
      </div>

    </div>
  )
}

export default App