import React from 'react'
import { Card, CardBody, CardFooter,Image } from '@nextui-org/react';
import { Item } from '@/utils/interfaces';
interface ItemCardProps{
    item:{
        itemId:string
        itemName:string
        itemDescription:string
        itemImage:string
        rentalOptions:{rentalOptionName: string, price: number}[]
        specifications:{specificationFeature:string,featureDetail:string}[]
        isRented:boolean
    }
    
    
}
function ItemCard({item}:ItemCardProps) {

    const { itemId,itemName,itemDescription,itemImage,rentalOptions} = item
    const handleCardClick = ()=>{

    }
  return (
    <Card shadow="sm">
        <CardBody className="overflow-visible p-0">
        <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={itemName}
            className="w-full object-cover"
            src={itemImage && itemImage.length > 0 ? itemImage[0]:'/assets/images/fruit-2.jpeg'}
        />
        </CardBody>
        <CardFooter className="text-small justify-between">
        <b>{itemName}</b>
        <p className="text-default-500">{item && rentalOptions && rentalOptions.length > 0 ? rentalOptions[0].price.toString() : 'N/A'}</p>
        </CardFooter>
  </Card>
  )
}

export default ItemCard