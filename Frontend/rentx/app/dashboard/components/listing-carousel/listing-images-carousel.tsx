import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'
import { ListingThumb } from './listing-carousel-thumb'
import { Button, Image } from '@nextui-org/react'
import { NextButton, PrevButton, usePrevNextButtons } from './listing-carousel-arrows'
import { FiPlus } from 'react-icons/fi'

interface ListingCarouselProps{
  imageList:string[];
  handleFileChange:(event:React.ChangeEvent<HTMLInputElement>)=>any;
  removeImage:(index:number)=>any
}
function ListingCarousel({imageList,handleFileChange,removeImage}:ListingCarouselProps) {
    const imgList = imageList
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
      containScroll: 'keepSnaps',
      dragFree: true,
    })
  
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
    <div className="embla flex flex-col gap-2">
    <div className="embla__viewport overflow-hidden" ref={emblaMainRef}>
      <div className="embla__container flex">
        {imgList.length!=0?
        imgList.map((img,index) => (
          <div className="embla__slide flex-shrink-0 flex-grow-0 w-full min-w-0" key={index}>
            <Image src={img} alt='product'/>
          </div>
        ))
        :
        <div className="embla__slide flex-shrink-0 flex-grow-0 w-full min-w-0">
            <Image src='/assets/images/1.jpg' alt='product'/>
          </div>
        }
      </div>
    </div>

    <div className="embla-thumbs ">
      <div className="embla-thumbs__viewport overflow-hidden " ref={emblaThumbsRef}>
        <div className="embla-thumbs__container flex flex-row gap-2 mt-4">
        <div className='flex-none w-[20%] min-w-0 cursor-pointer bg-default items-center justify-center rounded-[14px]'>
            <label htmlFor="file-input" className="flex w-full h-full items-center justify-center cursor-pointer">
              <FiPlus fontSize={25}/>
            </label>
      
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }}
            />
          </div>
          {imgList.map((img,index) => (
            <ListingThumb
              key={index}
              src={img}
              onClick={() =>{ onThumbClick(index)}}
              removeImage={removeImage}
              selected={index === selectedIndex}
              index={index}
            />
          ))}
          
        </div>
      </div>
    </div>

    
    {/* <div className="embla__controls grid grid-cols-2 justify-between mt-2">
        <div className="embla__buttons grid grid-cols-2 items-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div> */}
  </div>
  )
}

export default ListingCarousel