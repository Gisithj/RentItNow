import { END_RENT_ITEM } from '@/api/item'
import { fetchRentedItemsByRoleId } from '@/lib/features/updateTriggerSlice'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { RentalItem } from '@/utils/interfaces'
import { Card, CardBody, Button , Image, Link, User} from '@nextui-org/react'
import { addHours, formatDate } from 'date-fns'
import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdCall } from 'react-icons/md'
import { useSelector } from 'react-redux'


interface RentalRequestProps{
    rentalRequest:RentalItem
    handleEndRentalModelOpen:(itemId:string,rentalId:string)=>void
}
function RentalReqest({rentalRequest,handleEndRentalModelOpen}:RentalRequestProps) {
  
  console.log("==================================");
  console.log(rentalRequest);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleEndRentalClick = ()=>{
    handleEndRentalModelOpen(rentalRequest.itemID,rentalRequest.rentalId);
    // if(user){
    //   try {
    //     END_RENT_ITEM(rentalRequest.itemID,rentalRequest.rentalId).then((res)=>{
    //       console.log(res);
    //       dispatch(fetchRentedItemsByRoleId(user.roleId));
    //     }).catch((error)=>{
    //       console.log(error);
          
    //     })
    //   } catch (error) {
    //     console.log(error);
        
    //   }
    // }else{
    //   console.log("user not found");
    // }
  }
    
  const rentalOption = rentalRequest && rentalRequest.item.rentalOptions.find((option) => option.id === rentalRequest.rentalOptionId)?.rentalOptionName.toLowerCase();
  const calculateTotalPrice = () => {
    const price = rentalRequest && rentalRequest.item.rentalOptions.find((option) => option.id === rentalRequest.rentalOptionId)?.price;
    console.log(price);
    
    //rentalOption = rentalRequest && rentalRequest.item.rentalOptions.find((option) => option.id === rentalRequest.rentalOptionId)?.rentalOptionName.toLowerCase();
    console.log(rentalOption);
    
    let durationInMs = rentalRequest && (new Date(rentalRequest.rentalEndDate).getTime() - new Date(rentalRequest.rentalStartDate).getTime());
    console.log(durationInMs);
    let duration;
  
    if (rentalOption === "rent per hour") {
      duration = rentalRequest.hours;
    } else if (rentalOption === "rent per day") {
      duration = durationInMs / (1000 * 60 * 60 * 24);
    } else if (rentalOption === "rent per week") {
      duration = durationInMs / (1000 * 60 * 60 * 24 * 7);
    } else if (rentalOption === "rent per month") {
      duration = durationInMs / (1000 * 60 * 60 * 24 * 30);
    }
    console.log(duration);
    const total = price && duration && price * duration;
    console.log(total);
    return `Rs.${total?.toFixed(2)}`;
  };
  return (
    <Card
    isBlurred
    className="border-none bg-background/60 dark:bg-default-100/50 w-full p-4 min-h-[200px]"
    shadow="sm"
  >
    <CardBody>
      <div className="flex gap-10">
        <div>
          <Image
            alt="Album cover"
            className="object-cover"
            height={150}
            shadow="sm"
            src={rentalRequest.item.imageURLs[0]}
            width={150}
          />
        </div>
        

        <div className="flex flex-row gap-4 justify-between h-full w-full">
          <div className="flex justify-between  w-full">
            <div className="flex flex-col w-full items-start gap-2">
              <h1 className="font-semibold text-foreground/90">{rentalRequest.item.itemName}</h1>
              <h1 className="font-semibold text-foreground/90">{rentalOption}</h1>
              
              <div className="flex flex-col md:flex-row gap-4">
                {rentalOption !== 'rent per hour'?
                <>
                <div className="flex flex-col">
                  <p>From</p>
                  <h1 className="font-light text-foreground/90">{rentalRequest && formatDate(new Date(rentalRequest.rentalStartDate),'yyyy-MM-dd')}</h1>
                </div>
                <div className="flex flex-col">
                  <p>To</p>
                  <h3 className="font-light text-foreground/90">{rentalRequest && formatDate(new Date(rentalRequest.rentalEndDate),'yyyy-MM-dd')}</h3>
                </div>
                </>
                :
                <>
                <div className="flex flex-col">
                  <p>Date</p>
                  <h1 className="font-light text-foreground/90">{rentalRequest && formatDate(new Date(rentalRequest.rentalStartDate),'yyyy-MM-dd')}</h1>
                  
                </div>
                <div className="flex flex-row gap-3">
                  <div>
                    <p>From</p>
                    <h1 className="font-light text-foreground/90">{rentalRequest && formatDate(new Date(rentalRequest.rentalStartDate),'HH:mm')}</h1>
                  </div>
                  <div>
                    <p>To</p>
                    <h3 className="font-light text-foreground/90">{rentalRequest && formatDate(addHours(new Date(rentalRequest.rentalStartDate), rentalRequest.hours),'HH:mm')}</h3>
                  </div>
                </div>
                </>}
              </div>
              <p className="text-small text-foreground/80">{calculateTotalPrice()}</p>
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
                name={rentalRequest && rentalRequest.customer.name}

                description={(
                  <Link href="https://twitter.com/jrgarciadev" size="sm" className='text-xs font-normal' isExternal>
                    @{rentalRequest && rentalRequest.customer.name}
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
            
              <Button
                startContent={<AiOutlineEdit size={20} />}
                className="data-[hover]:bg-foreground/10"
                radius="lg"
                size='sm'
                variant="light"
                onClick={handleEndRentalClick}
              >
               End Rental
              </Button>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
  )
}

export default RentalReqest