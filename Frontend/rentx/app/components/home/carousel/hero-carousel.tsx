import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import HeroCard from './hero-card'
import useEmblaCarousel from 'embla-carousel-react'
export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop:true}, [Autoplay()])

  return (
    <div className="embla overflow-hidden">
         <div className="embla__viewport" ref={emblaRef}>
      <div className="embla__container flex">
        <div className="embla__slide flex-none flex-shrink-0 flex-grow-0 w-full min-w-0"><HeroCard/></div>
        <div className="embla__slide flex-none flex-shrink-0 flex-grow-0 w-full min-w-0"><HeroCard/></div>
        <div className="embla__slide flex-none flex-shrink-0 flex-grow-0 w-full min-w-0"><HeroCard/></div>
      </div>
      </div>
    </div>
  )
}