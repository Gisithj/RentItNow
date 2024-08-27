'use client'

import React, { use, useEffect, useState } from 'react'
import ItemCard from '../components/home/featured/item-card';
import Link from 'next/link';
import { GET_ALL_ITEMS_WITH_INCLUDE } from '@/api/item';
import { Pagination, Skeleton } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Item, PagedItem } from '@/utils/interfaces';
// import { Link } from '@nextui-org/react';

function Catelog({pagedItems,isLoading}:{pagedItems:PagedItem[],isLoading:boolean}) {
  
  const [items, setItems] = useState<PagedItem[]>(pagedItems);
  const [filteredItems, setFilteredItems] = useState<PagedItem[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(true);
  const {selectedCategories,isNotRented} = useSelector((state:RootState) => state.filterSlice);
  
  useEffect(() => {
    let filtered = pagedItems;
    if(selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }
    if(isNotRented) {
      filtered = filtered.filter(item => item.rentalStatus !== 'Rented');
    }
    setFilteredItems(filtered);
  }, [pagedItems, selectedCategories, isNotRented]);
  // const filterItemsByCategory = () => {
  //   if(selectedCategories.length>0){
  //     if(isNotRented){
  //       const filteredItems = items.filter((item:any) => selectedCategories.includes(item.category) && !item.isRented);
  //       setFilteredItems(filteredItems);
  //     }else{
  //       const filteredItems = items.filter((item:any) => selectedCategories.includes(item.category));
  //       console.log(filteredItems);
  //       setFilteredItems(filteredItems);
  //     }
      
      
      
      
      
  //   }else{
  //     console.log("in here no categories");      
  //     console.log(items);
  //     if(isNotRented){
  //       const filteredItems = items.filter((item:any) => !item.isRented);
  //       setFilteredItems(filteredItems);
  //     }else{        
  //       setFilteredItems(items);
  //       console.log(filteredItems);
  //     }
      
  //   }
  
  // }

  
  // useEffect(() => {
  //   console.log("isNotRented",isNotRented);
    
  //   filterItemsByCategory();
  // }, [items, selectedCategories,isNotRented]);

  // useEffect(() => {
  //   setItems(pagedItems);
  // }, [items]);


  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 max-h-c lg:grid-cols-5 xl:grid-cols-6 auto-rows-min gap-2 h-[75vh] 2xl:h-[80vh] overflow-y-auto w-full'>
      {isLoading ?
      Array.from({ length: 16 }).map((_, index) => (
        <Skeleton key={index} isLoaded={!isLoading} className='rounded-lg'>
            <div className="h-[20rem] w-[20rem] bg-default-300"></div>
        </Skeleton>
      ))
      :
      filteredItems && 
      filteredItems.length>0 ?
       filteredItems.map((item:any, index:number) => (
          <Link key={index} href={`/product/${item.itemId}`} prefetch={false} className='h-fit'>
            <ItemCard item={item} />
          </Link>
      ))
      :

      <div className='flex w-full h-full'>
        <h1 className='text-2xl font-bold'>No items found</h1>
      </div>
      }
  </div>
  )
}

export default Catelog