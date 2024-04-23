import React, { useEffect, useState } from 'react'
import Listing from './listing'
import { Button } from '@nextui-org/react'
import { GET_ALL_ITEMS_WITH_INCLUDE, GET_ITEMS_BY_RENTER_WITH_INCLUDE } from '@/api/item';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';

function ManageListings() {

  const router = useRouter()
  const [itemList,setItemList] = useState([])
  const [isItemListLoaded,setIsItemListLoaded] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user);

  const handleAddNewListingClick = ()=>{
    router.push(`/dashboard/add-new-listing`) 
  }

  useEffect(() => {
    user && GET_ITEMS_BY_RENTER_WITH_INCLUDE(user?.roleId).then((response) => {
      console.log("in herer");
      console.log(response);
      setItemList(response);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setIsItemListLoaded(true);
    });
    console.log(itemList);
  }, [user]);

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
                onPress={handleAddNewListingClick}
              >
                Add Listing
              </Button>
      </div>
      <div className='w-full flex flex-col gap-4'>
        {
          itemList && itemList.length>0 ? itemList.map((listing,index)=>(
            <Listing listing={listing} key={index}/>
          ))
          :
          <span>No items</span>
        }
       
      </div>
    </div>
  )
}

export default ManageListings