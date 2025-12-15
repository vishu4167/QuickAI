import React from 'react'
import { assets } from '../assets/assets'

const Footer: React.FC = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-32 pt-8 w-full text-gray-500">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
    
        <div className="md:max-w-96">
          <img className="h-9" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Create smarter, design faster, and innovate endlessly — all powered by cutting-edge AI tools.
          </p>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
        </div>

      </div>
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © Quick.AI. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
