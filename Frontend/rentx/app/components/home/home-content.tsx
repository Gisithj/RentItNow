'use client'
import React from 'react'
import { HeroCarousel } from './carousel/hero-carousel';
import FeaturesItems from './featured/featured-items';
import PopularCategories from './popular/popular-categories';
import LatestListings from './latest/latest-listings';


function HomeContent() {
  return (
    <div className='px-4 md:px-20 lg:px-44 py-4 md:py-10 flex flex-col gap-10'>      
      <HeroCarousel/>
      <LatestListings/>
      <FeaturesItems/>
      <PopularCategories/>      
    </div>
  )
}

export default HomeContent