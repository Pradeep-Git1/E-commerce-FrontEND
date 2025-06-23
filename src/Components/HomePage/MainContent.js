import React from 'react';
import HeroCarousel from '../MainContent/HeroCarousel';
import TopProducts from '../MainContent/TopProducts';
import Gallery from './Gallery';
import CompanyReels from './Reels';
import ClientReviewImageGallery from '../MainContent/ClientReviewImageGallery';
import BrowseByCategories from "./BrowseByCategories"; // IMPORT THE NEW COMPONENT
import SearchComponent from './SearchComponent';

// MainContent now accepts props from HomePage
function MainContent({ categories, categoriesLoading, categoriesError }) {
  return (
    <div>
      <HeroCarousel/>
      
      <BrowseByCategories
        categories={categories}
        loading={categoriesLoading}
        error={categoriesError}
      />
      <SearchComponent/>

      <TopProducts/>
      <Gallery/>
      <CompanyReels/>
      <ClientReviewImageGallery/>
    </div>
  )
}

export default MainContent;