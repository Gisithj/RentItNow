import { Card, CardBody, Button , Image, Link, User} from '@nextui-org/react'
import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdCall } from 'react-icons/md'

interface RentalRequestProps{
    rentalRequest:{
        itemId:string
        itemName:string
        itemDescription:string
        customerId:string
        startDate:string
        endDate:string
        hours?:string
        price:number
        itemImage:string

    }
}
function RentalReqest({rentalRequest}:RentalRequestProps) {
  return (
    <Card
    isBlurred
    className="border-none bg-background/60 dark:bg-default-100/50 w-full p-4"
    shadow="sm"
  >
    <CardBody>
      <div className="flex gap-10">
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
        

        <div className="flex flex-row gap-4 justify-between h-full w-full">
          <div className="flex justify-between  w-full">
            <div className="flex flex-col w-full items-start gap-2">
              <h1 className="font-semibold text-foreground/90">{rentalRequest.itemName}</h1>
              
              <div className="flex flex-col md:flex-row gap-4">
                <p>From</p>
                <h1 className="font-semibold text-foreground/90">{rentalRequest.startDate}</h1>
                <p>To</p>
                <h3 className="font-semibold text-foreground/90">{rentalRequest.endDate}</h3>
              </div>
              <p className="text-small text-foreground/80">Rs.3000.00</p>
             {/* <h1 className="text-large font-medium mt-2"></h1> */}
            </div>
           
          </div>

          <div className="flex flex-col w-full items-start gap-2">
            {/* <Button
              startContent={<AiOutlineEdit size={20} />}
              className="data-[hover]:bg-foreground/10"
              radius="lg"
              size='sm'
              variant="light"
            >
             Edit
            </Button> */}
            <User   
                className='text-xs font-semibold'
                name="Junior Garcia"

                description={(
                  <Link href="https://twitter.com/jrgarciadev" size="sm" className='text-xs font-normal' isExternal>
                    @jrgarciadev
                  </Link>
                )}
                avatarProps={{
                  size:"sm",
                  src: "https://avatars.githubusercontent.com/u/30373425?v=4"
                }}
              />
            <Button
              // isIconOnly
              startContent={<MdCall size={20}/>}
              className="data-[hover]:bg-foreground/10"
              radius="lg"
              size='sm'
              color='warning'
              variant="ghost"
            >
              Contact customer
            </Button>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
  )
}

export default RentalReqest