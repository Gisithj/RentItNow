import { Card, CardBody, Button, Slider,Image } from '@nextui-org/react'
import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import { PreviousIcon, NextIcon } from 'yet-another-react-lightbox'

interface ListingProps{
    listing:{
        itemId:string
        itemName:string
        itemDescription:string
        itemFeature:string
        priceOptions:string[]
        price:number
        itemImage:string

    }
}
function Listing({listing}:ListingProps) {
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
              height={200}
              shadow="sm"
              src="/assets/images/1.jpg"
              width={200}
            />
          </div>

          <div className="flex flex-col gap-4 justify-between h-full">
            <div className="flex justify-between  w-full">
              <div className="flex flex-col w-full items-end">
                <h3 className="font-semibold text-foreground/90">Tangerine</h3>
                <p className="text-small text-foreground/80">Rs.3000.00</p>
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