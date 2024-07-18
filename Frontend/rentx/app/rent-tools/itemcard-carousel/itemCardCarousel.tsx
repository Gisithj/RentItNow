import React, { useCallback, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {Image} from "@nextui-org/react";
import { delay } from "framer-motion";

type PropType = {
  slides: string[];
  isItemCardCaroselHovered:boolean
  itemId:string
  hoverdItemId:string
};

const ItemCardCarousel = ({slides,isItemCardCaroselHovered,itemId,hoverdItemId}:PropType) => {

    // if(hoverdItemId==itemId){}
    const options: EmblaOptionsType = { loop: true }
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
      Autoplay({ playOnInit: false, delay:1500})
    ])
    // const [isPlaying, setIsPlaying] = useState(false)

    const toggleAutoplay = useCallback(() => {
      const autoplay:any = emblaApi && emblaApi.plugins().autoplay;
      if (!autoplay) return;  
      const playOrStop = autoplay && autoplay.isPlaying() ? autoplay.stop : autoplay.play
      playOrStop()
    }, [emblaApi])

    
  // useEffect(() => {
  //   const autoplay:any = emblaApi?.plugins()?.autoplay;
  //   if (!autoplay) return;

  //   setIsPlaying(autoplay && autoplay.isPlaying())
  //   emblaApi!
  //     .on("autoplay:play" as any, () => setIsPlaying(true))
  //     .on('autoplay:stop' as any, () => setIsPlaying(false))
  //     .on('reInit', () => setIsPlaying(autoplay && autoplay.isPlaying()))
  // }, [emblaApi])

  useEffect(()=>{
    const autoplay:any = emblaApi && emblaApi.plugins().autoplay;
    if(itemId===hoverdItemId){
      toggleAutoplay()
    }else{
      if(autoplay && autoplay.isPlaying()){
        toggleAutoplay()
      }
    }
  },[itemId,hoverdItemId])
  return (
    <section className="embla overflow-hidden">
         <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((img,index) => (
            <div className="embla__slide flex-none flex-shrink-0 flex-grow-0 w-full max-h-[400px] min-w-0" key={index}>
              
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={"item image"}
                className="w-full object-cover rounded-none"
                src={img}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemCardCarousel;
