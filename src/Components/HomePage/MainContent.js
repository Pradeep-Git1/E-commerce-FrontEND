import React from 'react'
import HeroCarousel from '../MainContent/HeroCarousel'
import TopProducts from '../MainContent/TopProducts'
import Gallery from './Gallery'
import CompanyReels from './Reels'

function MainContent() {
  return (
    <div>
        <HeroCarousel/>
        <TopProducts/>
        <Gallery/>
        {/* <CompanyReels/> */}
    </div>
  )
}

export default MainContent