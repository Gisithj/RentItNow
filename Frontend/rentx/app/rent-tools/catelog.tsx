'use client'
import Link from 'next/link';
import React from 'react'
import ItemCard from '../components/home/featured/item-card';

function Catelog() {
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
        },
       
        {
          itemId:"7",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"8",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"9",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"10",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"11",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"12",
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
        },
       
        {
          itemId:"7",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"8",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"9",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"10",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"11",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"12",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"7",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"8",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"9",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"10",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"11",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"12",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"7",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"8",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"9",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"10",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"11",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"12",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"7",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"8",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"9",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"10",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
        {
          itemId:"11",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
        {
          itemId:"12",
          itemName:"Tangerine",
          itemTitle:"Tangerine",
          itemImage: "/assets/images/fruit-2.jpeg",
          price:20
        },
       
      ];
  return (
    <div className='grid grid-cols-2 sm:grid-cols-6 gap-2'>
    {list.map((item, index) => (
      <Link key={index} href={`/product/${item.itemId}`}>
        <ItemCard item={item} />
      </Link>
    ))}
  </div>
  )
}

export default Catelog