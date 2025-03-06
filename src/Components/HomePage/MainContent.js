import React from 'react'
import HeroCarousel from '../MainContent/HeroCarousel'
import TopProducts from '../MainContent/TopProducts'
import LuxuryChocolates from '../MainContent/LuxuryChocolates'
import GiftChocolates from '../MainContent/GiftChocolates'
import PremiumCustomisable from '../MainContent/PremiumCustomisable'

function MainContent() {
  return (
    <div>
        <HeroCarousel/>
        <TopProducts/>
        <LuxuryChocolates/>
        <GiftChocolates/>
        <PremiumCustomisable/>
    </div>
  )
}

export default MainContent