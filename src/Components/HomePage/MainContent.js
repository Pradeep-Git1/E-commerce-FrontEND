import React from 'react'
import HeroCarousel from '../MainContent/HeroCarousel'
import TopProducts from '../MainContent/TopProducts'
import Gallery from './Gallery'
import CompanyReels from './Reels'
import ClientReviewImageGallery from '../MainContent/ClientReviewImageGallery'

function MainContent() {
  return (
    <div>
        <HeroCarousel/>
        <TopProducts/>
        <Gallery/>
        <CompanyReels/>
        <ClientReviewImageGallery/>
    </div>
  )
}

export default MainContent