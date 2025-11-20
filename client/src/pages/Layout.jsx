import React, { useState } from 'react' 
import { Outlet } from 'react-router-dom' 
import { assets } from '../assets/assets' 
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => { 
  const [sidebar, setSidebar] = useState(false) 
  const { user } = useUser() 

  return user ? ( 
    <div className='flex flex-col items-start justify-start min-h-screen'> 
      <Navbar sidebar={sidebar} setSidebar={setSidebar} />
      
      <div className='flex-1 w-full flex h-[calc(100vh-64px)] pt-20'> 
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} /> 
        <div className='flex-1 bg-[#F4F7FB] pt-8'> 
          <Outlet/> 
        </div> 
      </div> 
    </div> 
  ) : ( 
    <div className='flex items-center justify-center h-screen'> 
      <SignIn/> 
    </div> 
  ) 
} 

export default Layout