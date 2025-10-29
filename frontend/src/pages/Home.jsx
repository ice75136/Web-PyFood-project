import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'


const Home = () => {
  return (
    <div className='border-t border-gray-300 pt-5'>
        <Hero/>
        <LatestCollection/>
        <BestSeller/>
        {/* <OurPolicy/> */}
        
    </div>
  )
}

export default Home