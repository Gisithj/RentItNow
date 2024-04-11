import React from 'react'
import { Image } from '@nextui-org/react'
export const Thumb = (props:any) => {
  const { selected, index,src, onClick } = props

  return (
    <div
      className={'embla-thumbs__slide flex-none w-[10%] min-w-0 cursor-pointer'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
      onClick={onClick}
    >
        <>
        <Image src={src || '/assets/images/1.jpg'} alt='product' className="embla-thumbs__slide__number"/>

        </>
      {/* <button        
        type="button"
        className="embla-thumbs__slide__number"
      >
        {index + 1}
      </button> */}
    </div>
  )
}
