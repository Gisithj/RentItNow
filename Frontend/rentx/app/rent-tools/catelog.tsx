'use client'

import React, { useEffect, useState } from 'react'
import ItemCard from '../components/home/featured/item-card';
import Link from 'next/link';
import { GET_ALL_ITEMS_WITH_INCLUDE } from '@/api/item';
import { Skeleton } from '@nextui-org/react';
// import { Link } from '@nextui-org/react';

function Catelog() {
  
  const [items, setItems] = useState([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  // let items =[{}];

  
  useEffect(() => {
    GET_ALL_ITEMS_WITH_INCLUDE().then((response) => {
      console.log("in herer");
      console.log(response);
      setItems(response);
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setItemsLoaded(true);
    });
    console.log(items);
  }, []);
   

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-2 h-fit'>
      {!itemsLoaded ?
      Array.from({ length: 16 }).map((_, index) => (
        <Skeleton key={index} isLoaded={itemsLoaded} className='rounded-lg'>
            <div className="h-40 w-40 aspect-square bg-default-300"></div>
        </Skeleton>
      ))
      :
      items && items.length>0 && items.map((item:any, index:number) => (
        // <Skeleton key={index} isLoaded={!itemsLoading}>
          <Link key={index} href={`/product/${item.itemId}`} className='h-fit'>
            <ItemCard item={item} />
          </Link>
        // </Skeleton>
      ))
      }
   
  </div>
  )
}

export default Catelog