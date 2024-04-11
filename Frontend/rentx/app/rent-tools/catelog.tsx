'use client'

import React, { useEffect, useState } from 'react'
import ItemCard from '../components/home/featured/item-card';
import Link from 'next/link';
import { GET_ALL_ITEMS_WITH_INCLUDE } from '@/api/item';
// import { Link } from '@nextui-org/react';

function Catelog() {
  
  const [items, setItems] = useState([]);
  // let items =[{}];

  
  useEffect(() => {
    GET_ALL_ITEMS_WITH_INCLUDE().then((response) => {
      console.log("in herer");
      console.log(response);
      setItems(response);
    }).catch((error) => {
      console.error(error);
    });
    console.log(items);
  }, []);
   

  return (
    <div className='grid grid-cols-2 sm:grid-cols-6 gap-2'>
    {items.length>0 && items.map((item:any, index:number) => (
      <Link key={index}  href={`/product/${item.itemId}`} className='h-fit'>
        <ItemCard item={item} />
      </Link>
    ))}
  </div>
  )
}

export default Catelog