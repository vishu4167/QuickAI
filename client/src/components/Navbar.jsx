import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = ({ sidebar, setSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  
  const isDashboard = location.pathname.startsWith('/ai')
  
  return (
    <div className='fixed z-[100] w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
      
      <div className='flex items-center gap-3'>
      {user && isDashboard && (
        <button 
          onClick={() => setSidebar(!sidebar)}
          className='sm:hidden p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95'
          style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {sidebar ? (
              <X className='w-6 h-6 text-gray-800' strokeWidth={2.5} />
            ) : (
              <Menu className='w-6 h-6 text-gray-800' strokeWidth={2.5} />
            )}
          </button>
        )}
        
        <img 
          src={assets.logo} 
          alt='logo' 
          className='w-32 h-10 sm:w-44 cursor-pointer'
          onClick={() => navigate('/')}
        />
      </div>

      {user ? (
        <UserButton />
      ) : (
        <button 
          onClick={openSignIn}
          style={{ backgroundColor: '#5044E5' }} 
          className='text-white px-8 py-2 rounded-full flex items-center gap-2 cursor-pointer'
        >
          Get Started
          <ArrowRight className='w-4 h-4'/>
        </button>
      )}
    </div>
  )
}

export default Navbar