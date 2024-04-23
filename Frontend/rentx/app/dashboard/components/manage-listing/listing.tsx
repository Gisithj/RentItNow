'use client'
import { DELETE_ITEM } from '@/api/item'
import { Card, CardBody, Button, Slider,Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { FaCircleCheck } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { PreviousIcon, NextIcon } from 'yet-another-react-lightbox'

interface ListingProps{
    listing:{
        itemId:string
        itemName:string
        itemDescription:string
        itemOverview:string
        itemFeature:string
        rentalOptions:{
          rentalOptionName: string,
          price: number
        }[]
        imageURLs:string[]
    }
    handleEditListingClick?:()=>any
}
function Listing({listing,handleEditListingClick}:ListingProps) {
  
  const router = useRouter();
  const [isDeleteFinished,setIsDeleteFinished] = useState(false)
  const [isDeleteInit,setIsDeleteInit] = useState(false)
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const handleDeleteClick = ()=>{
    setIsDeleteInit(true)
    DELETE_ITEM(listing.itemId).then((response) => {
      console.log("in herer");
      console.log(response);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setIsDeleteFinished(true);
    });
  }
  const handleEditClick = ()=>{
    router.push(`/dashboard/edit-listing/${listing.itemId.toString()}`) 
  }
  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 w-full p-4"
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
                <p className="text-small text-foreground/80">{listing.rentalOptions[1].price}</p>
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
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"/>
              <ModalBody className="flex flex-col items-center text-center">
                <FaCircleCheck fontSize={30} className="text-success"/>
                <h1 className="text-xl font-medium">Listing is deleted!!</h1>
               
              </ModalBody>
              <ModalFooter className="flex flex-col items-center text-center">
                <Button color="primary" variant="solid" onPress={()=>{onClose()}}>
                  Return to listings
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  )
}

export default Listing