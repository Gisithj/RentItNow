import React from 'react'
import { Card, CardBody, CardFooter,Image } from '@nextui-org/react';

interface ItemCardProps{
    item:{
        itemId:string
        itemName:string
        itemTitle:string
        itemImage:string
        price:number
    }
    
    
}
function ItemCard({item}:ItemCardProps) {

    const { itemId,itemName,itemTitle,itemImage,price} = item
    const handleCardClick = ()=>{

    }
  return (
    <Card shadow="sm" isPressable onPress={() => console.log("item pressed")} onClick={handleCardClick}>
        <CardBody className="overflow-visible p-0">
        <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={item.itemTitle}
            className="w-full object-cover"
            src={item.itemImage}
        />
        </CardBody>
        <CardFooter className="text-small justify-between">
        <b>{item.itemTitle}</b>
        <p className="text-default-500">{item.price}</p>
        </CardFooter>
  </Card>
  )
}

export default ItemCard