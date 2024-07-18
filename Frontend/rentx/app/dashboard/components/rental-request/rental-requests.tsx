import { Button, CircularProgress, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, user } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import RentalReqest from './rental-request-card';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { connection, subscribeToOffers } from '@/utils/signalrService';
import { END_RENT_ITEM } from '@/api/item';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchRentedItemsByRoleId } from '@/lib/features/updateTriggerSlice';
import { useAppDispatch } from '@/lib/hooks';
import { FaCircleCheck } from 'react-icons/fa6';
function RentalRequests() {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isItemListLoaded,setIsItemListLoaded] = useState(false)
  const { rentalRequestList} = useSelector((state:RootState) => state.updateTrigger)
  const {isOpen, onOpen, onClose,onOpenChange} = useDisclosure();
  const [isEndRentalConfirmed,setIsEndRentalConfirmed] = useState(false)
  const [isRentalEnded,setIsRentalEnded] = useState(false)
  const [rentalRequest,setRentalRequest] = useState({itemId: '', rentalId: ''})

  const handleEndRentalModelOpen = (itemId:string,rentalId:string)=>{
    console.log("in EndRental model open");
    setIsRentalEnded(false);
    setIsEndRentalConfirmed(false)    
    setRentalRequest({itemId: itemId, rentalId: rentalId})    
    onOpen()
    
  }

  const handleEndRentalClick = ()=>{
   if(user){
    setIsEndRentalConfirmed(true)    
    END_RENT_ITEM(rentalRequest.itemId,rentalRequest.rentalId).then((response) => {
      console.log(response);
      dispatch(fetchRentedItemsByRoleId(user.roleId));
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setIsRentalEnded(true);
    });
   }else{
      console.log("user not found");
    
   }
  }
  useEffect(() => {
    if(user){
      dispatch(fetchRentedItemsByRoleId(user.roleId));
      console.log("in herer");
      console.log(rentalRequestList);
      
    }
  }, [user]);

//     let connection = new HubConnectionBuilder()
//     .withUrl("https://localhost:44375/chat", { withCredentials: true })
//     .build();

// connection.start()
//     .then(function () {
//         console.log("connected");
//        // connection.invoke("SendRentalRequestToRenter", "31BE38E3-2F0B-4638-BD57-08DC57186DBB","7FA8F11F-8BE2-4B8C-14AE-08DC56CB133A")
//     // .catch(err => console.error("Error sending request:", err));
//     })
//     .catch(function (err) {
//         return console.error(err.toString());
//     });

  
// connection.on("SendOffersToUser", function(message) {
//   console.log(message);
// });
  return (
    <div className='w-full flex flex-col gap-4'>
    <div className='flex flex-row justify-between'>
      <h1 className='text-2xl font-bold'>Rental Requests</h1>
    </div>
    <div className='w-full flex flex-col gap-4 overflow-y-auto h-[650px]'>
      {
        rentalRequestList && rentalRequestList.map((request,index)=>(
          <RentalReqest rentalRequest={request} key={index} handleEndRentalModelOpen={handleEndRentalModelOpen}/>
        ))
      }
     
    </div>
  <Modal 
    isOpen={isOpen} 
    onOpenChange={onOpenChange} 
    isDismissable={true} 
    backdrop="opaque"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
  >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"/>
              <ModalBody className="flex flex-col items-center text-center">
                {!isEndRentalConfirmed?
                <>
                <h1 className="text-xl font-medium">
                  Are you sure you want to end the rental of this item?
                </h1>
              
                </>
                :
                !isRentalEnded?
                <CircularProgress color="default" aria-label={'Deleting the item...'}/>
                :
                <>
                <FaCircleCheck fontSize={30} className="text-success"/>
                
                <h1 className="text-xl font-medium">
                  {!isRentalEnded?'Deleting the item...':'Your item is Rental Ended successfully!!'}
                </h1>
                </>
               }
              </ModalBody>
              <ModalFooter className="flex flex-col items-center text-center">
                {!isEndRentalConfirmed && !isRentalEnded?
                <div className='flex gap-2'>
                  <Button color="danger" variant="bordered" onPress={onClose}>
                  No
                </Button>
                <Button color="danger" variant="solid" onPress={()=>handleEndRentalClick()}>
                  Confirm EndRental
                </Button>
                </div>
                :
                <Button color="primary" variant="solid" onPress={onClose}>
                  Return to listings
                </Button>
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  </div>
  )
}

export default RentalRequests