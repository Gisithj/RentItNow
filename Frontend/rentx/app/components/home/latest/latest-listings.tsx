import React from 'react'
import ItemCard from '../featured/item-card';
import { Link } from '@nextui-org/react';

function LatestListings() {
    const list = [
        {
            itemId:"1",
            itemName:"Tangerine",
            itemTitle:"Tangerine",
            itemImage: "/assets/images/fruit-2.jpeg",
            price:20
          },
          {
            itemId:"2",
            itemName:"Tangerine",
            itemTitle:"Tangerine",
            itemImage: "/assets/images/fruit-2.jpeg",
            price:20
          },
          {
            itemId:"3",
            itemName:"Tangerine",
            itemTitle:"Tangerine",
            itemImage: "/assets/images/fruit-2.jpeg",
            price:20
          },
          {
            itemId:"4",
            itemName:"Tangerine",
            itemTitle:"Tangerine",
            itemImage: "/assets/images/fruit-2.jpeg",
            price:20
          },
          {
            itemId:"5",
            itemName:"Tangerine",
            itemTitle:"Tangerine",
            itemImage: "/assets/images/fruit-2.jpeg",
            price:20
          },
         
          {
            itemId:"6",
            itemName:"Tangerine",
            itemTitle:"Tangerine",
            itemImage: "/assets/images/fruit-2.jpeg",
            price:20
          }
       
       
      ];
  return (
    <div className="flex flex-col gap-4">
    <div>
      <span className='text-2xl font-bold'>Latest listings</span>
    </div>
    <div className='gap-2 grid grid-cols-2 sm:grid-cols-6'>
      {list.map((item, index) => (
        <Link key={index} href={`/product/${item.itemId}`}>
            <ItemCard item={item} />
        </Link>
      ))}
    </div>
  </div>
  )
}

export default LatestListings