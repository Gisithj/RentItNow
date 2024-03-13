import React from 'react'
import Listing from './listing'
import { Button } from '@nextui-org/react'

interface ManageListingsProps{
  handleNewListingClick:()=>any
}
function ManageListings({handleNewListingClick}:ManageListingsProps) {
  const list = [
    {      

        itemId:"1",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        itemFeature:'size',
        priceOptions:['day,week,month'],
        itemImage: "/assets/images/fruit-2.jpeg",
        price:20
      },
      {
        itemId:"2",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        itemFeature:'size',
        priceOptions:['day,week,month'],
        itemImage: "/assets/images/fruit-2.jpeg",
        price:20
      },
      {
        itemId:"3",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        itemFeature:'size',
        priceOptions:['day,week,month'],
        itemImage: "/assets/images/fruit-2.jpeg",
        price:20
      },
      {
        itemId:"4",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        itemFeature:'size',
        priceOptions:['day,week,month'],
        itemImage: "/assets/images/fruit-2.jpeg",
        price:20
      },
      {
        itemId:"5",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        itemFeature:'size',
        priceOptions:['day,week,month'],
        itemImage: "/assets/images/fruit-2.jpeg",
        price:20
      },
     
      {
        itemId:"6",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        itemFeature:'size',
        priceOptions:['day,week,month'],
        itemImage: "/assets/images/fruit-2.jpeg",
        price:20
      }
   
   
  ];
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-2xl font-bold'>ManageListings</h1>
        <Button
                // isIconOnly
                //startContent={<MdDeleteOutline size={20}/>}
                className="data-[hover]:bg-foreground/10"
                radius="lg"
                variant="solid"
                onPress={handleNewListingClick}
              >
                Add Listing
              </Button>
      </div>
      <div className='w-full flex flex-col gap-4'>
        {
          list.map((listing,index)=>(
            <Listing listing={listing} key={index}/>
          ))
        }
       
      </div>
    </div>
  )
}

export default ManageListings