'use client'
import { DELETE_ITEM } from '@/api/item'
import { GetItem } from '@/utils/interfaces'
import { Card, CardBody, Button, Slider,Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { FaCircleCheck } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { PreviousIcon, NextIcon } from 'yet-another-react-lightbox'

interface ListingProps{
    listing:GetItem
    handleEditListingClick?:()=>any
    handleDeleteModelOpen?:(itemId:string)=>any
}
function Listing({listing,handleEditListingClick,handleDeleteModelOpen}:ListingProps) {
  
  const router = useRouter();  

  const handleEditClick = ()=>{
    router.push(`/dashboard/edit-listing/${listing.itemId.toString()}`) 
  }

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 w-full p-4 min-h-[160px]"
      shadow="sm"
    >
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <Image
              alt="Album cover"
              className="object-cover"
              height={100}
              shadow="sm"
              src={listing.imageURLs[0]}
              width={100}
            />
          </div>
          <div>{listing.itemDescription}</div>
          <div className="flex flex-col gap-4 justify-between h-full">
            <div className="flex justify-between  w-full">
              <div className="flex flex-col w-full items-end">
                <h3 className="font-semibold text-foreground/90">{listing.itemName}</h3>
                <p className="text-small text-foreground/80">{listing.rentalOptions[0].price}</p>
               {/* <h1 className="text-large font-medium mt-2"></h1> */}
              </div>
             
            </div>

            <div className="flex w-full items-center justify-center gap-2">
              <Button
                startContent={<AiOutlineEdit size={20} />}
                className="data-[hover]:bg-foreground/10"
                radius="lg"
                size='sm'
                variant="light"
                onClick={handleEditClick}
              >
               Edit
              </Button>
              <Button
                // isIconOnly
                startContent={<MdDeleteOutline size={20}/>}
                className="data-[hover]:bg-foreground/10"
                radius="lg"
                size='sm'
                color='danger'
                variant="ghost"
                onClick={()=>handleDeleteModelOpen && handleDeleteModelOpen(listing.itemId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default Listing