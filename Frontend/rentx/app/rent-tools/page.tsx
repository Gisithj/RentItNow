'use client'
import React, { useEffect, useState } from 'react'
import CatelogSidebar from './catelog-sidebar'
import Catelog from './catelog'
import { Pagination } from '@nextui-org/react'
import { GET_ALL_AVAILABLE_ITEMS_IN_DATERANGE_WITH_INCLUDE_PAGED, GET_ALL_ITEMS_WITH_INCLUDE_PAGED } from '@/api/item';
import { PagedItem } from '@/utils/interfaces'
import { RootState } from '@/lib/store'
import { useSelector } from 'react-redux'
import { Metadata } from 'next'


function ItemCatelog() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [items, setItems] = useState<PagedItem[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const [isAvailabilityChecking, setIsAvailabilityChecking] = useState(false);
  const {availabilityDateRange} = useSelector((state:RootState) => state.filterSlice);
  const handleIsAvailabilityChecking = () => {
    setIsAvailabilityChecking(true);
  }
  useEffect(() => {
    setIsLoading(true);
    if(!isAvailabilityChecking){
      GET_ALL_ITEMS_WITH_INCLUDE_PAGED(currentPage,pageSize).then((response) => {
        console.log("in herer");
        console.log(response);
        setItems(response);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        setIsLoading(false);
      });
    }else{
      GET_ALL_AVAILABLE_ITEMS_IN_DATERANGE_WITH_INCLUDE_PAGED(currentPage,pageSize,availabilityDateRange.startDate,availabilityDateRange.endDate).then((response) => {
        console.log("in herer");
        console.log(response);
        setItems(response);
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        setIsLoading(false);        
        setIsAvailabilityChecking(false);
      });
    }
    console.log(items);
  }, [currentPage,availabilityDateRange]);


  return (
    <div className='px-4 sm:px-10 lg:px-10 py-4 sm:py-8 flex flex-row gap-10'>
        <CatelogSidebar handleIsAvailabilityChecking={handleIsAvailabilityChecking}/>
        <div className='flex flex-col gap-4 w-[100vw]'>
          <Catelog pagedItems={items} isLoading={isLoading}/>
          
          <Pagination 
          className='flex justify-center'
          showControls total={10} 
          initialPage={1}  
          page={currentPage}
          onChange={setCurrentPage} 
          size='sm' />
        </div>
    
    </div>
  )
}

export default ItemCatelog