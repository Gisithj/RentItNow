import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Thumb } from './product-carousel-thumb'
import { Image } from '@nextui-org/react'
import { NextButton, PrevButton, usePrevNextButtons } from './product-carousel-arrows'

interface ProductCarouselProps {
    images: string[]
}
function ProductCarousel({images}: ProductCarouselProps) {

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
      containScroll: 'keepSnaps',
      dragFree: true,
    })
    const [isProductImageNotLoaded, setIsProductImageNotLoaded] = useState(false)
    const onThumbClick = useCallback(
      (index:any) => {
        if (!emblaMainApi || !emblaThumbsApi) return
        emblaMainApi.scrollTo(index)
      },
      [emblaMainApi, emblaThumbsApi]
    )
  
    const onSelect = useCallback(() => {
      if (!emblaMainApi || !emblaThumbsApi) return
      setSelectedIndex(emblaMainApi.selectedScrollSnap())
      emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])
  
    const onNavButtonClick = useCallback((emblaApi:any) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return
    
        const resetOrStop =
          autoplay.options.stopOnInteraction === false
            ? autoplay.reset
            : autoplay.stop
    
        resetOrStop()
      }, [])
    
      const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
      } = usePrevNextButtons(emblaMainApi, onNavButtonClick)

    useEffect(() => {
      if (!emblaMainApi) return
      onSelect()
      emblaMainApi.on('select', onSelect)
      emblaMainApi.on('reInit', onSelect)
    }, [emblaMainApi, onSelect])

  return (
    <div className="embla flex flex-col gap-4">
    <div className="embla__viewport overflow-hidden" ref={emblaMainRef}>
      <div className="embla__container flex">
        {images.map((img,index) => (
          <div className="embla__slide max-h-[400px] flex-shrink-0 flex-grow-0 w-full min-w-0 flex justify-center" key={index}>
             {isProductImageNotLoaded ? 
              <div className="flex place-items-center place-content-center h-[400px] w-[100%] bg-default-100">Error in image loading</div>
              :
            <Image 
              src={img} 
              alt='product' 
              className='max-h-[400px]' 
              fallbackSrc="assets/images/fruit-2.jpeg"
              onError={()=>setIsProductImageNotLoaded(true)}
              onLoad={()=>setIsProductImageNotLoaded(false)}
              />
             }
          </div>
        ))}
      </div>
    </div>

    {!isProductImageNotLoaded && <div className="embla-thumbs ">
      <div className="embla-thumbs__viewport overflow-hidden" ref={emblaThumbsRef}>
        <div className="embla-thumbs__container flex flex-row gap-2 justify-center">
          {images.map((img,index) => (
            <Thumb
              key={index}
              onClick={() =>{ onThumbClick(index)}}
              selected={index === selectedIndex}
              index={index}
              src={img || '/assets/images/1.jpg'}
            />
          ))}
        </div>
      </div>
    </div>}

    
    {/* <div className="embla__controls grid grid-cols-2 justify-between mt-2">
        <div className="embla__buttons grid grid-cols-2 items-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div> */}
  </div>
  )
}

export default ProductCarousel