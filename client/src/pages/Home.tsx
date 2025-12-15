import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  const [sidebar, setSidebar] = useState<boolean>(false)
  
  return (
    <>
      <Navbar sidebar={sidebar} setSidebar={setSidebar} />
      <Hero />
      <AiTools />
      <Testimonial />
      <Plan />
      <Footer />
    </>
  )
}

export default Home
