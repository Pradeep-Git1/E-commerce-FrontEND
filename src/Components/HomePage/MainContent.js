import React from 'react'
import HeroCarousel from '../MainContent/HeroCarousel'
import TopProducts from '../MainContent/TopProducts'
import GiftChocolates from '../MainContent/GiftChocolates'
import PremiumCustomisable from '../MainContent/PremiumCustomisable'
import Gallery from './Gallery'
import CompanyReels from './Reels'

function MainContent() {
  return (
    <div>
        <HeroCarousel/>
        <TopProducts/>
        <Gallery/>
        <CompanyReels/>
        <GiftChocolates/>
        <PremiumCustomisable/>
    </div>
  )
}

export default MainContent