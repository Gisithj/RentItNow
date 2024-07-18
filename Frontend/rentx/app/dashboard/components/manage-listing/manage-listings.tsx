import React, { useEffect, useState } from 'react'
import Listing from './listing'
import { Button, CircularProgress, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { DELETE_ITEM, GET_ALL_ITEMS_WITH_INCLUDE, GET_ITEMS_BY_RENTER_WITH_INCLUDE } from '@/api/item';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FaCircleCheck } from 'react-icons/fa6';
import { set } from 'date-fns';
import { fetchItemsByRoleId } from '@/lib/features/updateTriggerSlice';
import { useAppDispatch } from '@/lib/hooks';

function ManageListings() {

  const router = useRouter()
  const dispatch = useAppDispatch();
  const [isItemListLoaded,setIsItemListLoaded] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user);
  const { rentalItemList, status, error } = useSelector((state:RootState) => state.updateTrigger)
  const {isOpen, onOpen,onClose, onOpenChange} = useDisclosure();
  const [isDeleteConfirmed,setIsDeleteConfirmed] = useState(false)
  const [isDeleteStarted,setIsDeleteStarted] = useState(false)
  const [isDeleted,setIsDeleted] = useState(false)
  const [deletedItemId,setDeletedItemId] = useState('')

  const handleAddNewListingClick = ()=>{
    router.push(`/dashboard/add-new-listing`) 
  }

  const handleDeleteModelOpen = (itemId:string)=>{
    console.log("in delete model open");
    onOpen()
    setDeletedItemId(itemId)
    setIsDeleted(false);

    
  }

  const handleDeleteClick = ()=>{
   if(user){
    setIsDeleted(false);
    setIsDeleteConfirmed(true)
    
    console.log("in delete click");
    
    setIsDeleteStarted(true)
    DELETE_ITEM(deletedItemId).then((response) => {
      console.log("in herer");
      console.log(response);
      dispatch(fetchItemsByRoleId(user.roleId));
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setIsDeleted(true);
      setIsDeleteStarted(false);
      setIsDeleteConfirmed(false)
    });
  }else{
      console.log("user not found");
  }
}

  useEffect(() => {
    if(user){
      dispatch(fetchItemsByRoleId(user.roleId));
      console.log("in herer");
      console.log(rentalItemList);
      
    }
  }, [user]);

  return (
    <div className='w-full flex flex-col gap-4 overflow-y-hidden'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-2xl font-bold'>ManageListings</h1>
        <Button
                // isIconOnly
                //startContent={<MdDeleteOutline size={20}/>}
                id='add_new_listing_button'
                className="data-[hover]:bg-foreground/10"
                radius="lg"
                variant="solid"
                onPress={handleAddNewListingClick}
              >
                Add Listing
              </Button>
      </div>
      <div className='w-full flex flex-col gap-4 overflow-y-auto h-[450px] 2xl:h-[650px]'>
        {
          rentalItemList && rentalItemList.length>0 ? rentalItemList.map((listing,index)=>(
            <Listing listing={listing} key={index} handleDeleteModelOpen={handleDeleteModelOpen}/>
          ))
          :
          <span>No items</span>
        }
       
      </div>
      
      <Modal 
        size="lg" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
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
                {!isDeleteConfirmed?
                <>
                <h1 className="text-xl font-medium">
                  Are you sure you want to delete this item?
                </h1>
                <p className='text-sm'>All the record related to this item will be delete</p>
                </>
                :
                !isDeleted ?
                <CircularProgress color="default" aria-label={'Deleting the item...'}/>
                :
                <>
                <FaCircleCheck fontSize={30} className="text-success"/>
                
                <h1 className="text-xl font-medium">
                  {!isDeleted?'Deleting the item...':'Your item is deleted successfully!!'}
                </h1>
                </>
               }
              </ModalBody>
              <ModalFooter className="flex flex-col items-center text-center">
                {!isDeleteConfirmed  && !isDeleted?
                <div className='flex gap-2'>
                  <Button color="danger" variant="bordered" onPress={onClose}>
                  No
                </Button>
                <Button color="danger" variant="solid" onPress={()=>handleDeleteClick()}>
                  Confirm Delete
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

export default ManageListings