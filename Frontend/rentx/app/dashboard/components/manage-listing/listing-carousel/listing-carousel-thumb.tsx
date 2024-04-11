import React from 'react'
import { Badge, Image } from '@nextui-org/react'
import { IoIosClose } from 'react-icons/io'
export const ListingThumb = (props:any) => {
  const { selected, index, onClick,src,removeImage } = props

  return (
    
      <div
        className={'embla-thumbs__slide flex-none w-[20%] min-w-0 cursor-pointer'.concat(
          selected ? ' embla-thumbs__slide--selected' : ''
        )}
       
      >
          <Badge content={<IoIosClose fontSize={20}/>}color='default' shape='circle' className='px-0' onClick={()=>removeImage(index)}>
          <Image src={src} alt='product' className="embla-thumbs__slide__number"  onClick={onClick}/>
          </Badge>
        {/* <button
          type="button"
          className="embla-thumbs__slide__number"
        >
          {index + 1}
        </button> */}
      </div>
    
  )
}
