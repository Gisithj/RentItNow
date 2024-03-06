import React from 'react'
import { Card, CardBody, CardFooter,Image } from '@nextui-org/react';

interface CategoryCardProps{
    category:{
        categoryId:string
        categoryName:string
        categoryImage:string
    }
    
    
}
function CategoryCard({category}:CategoryCardProps) {

    const { categoryId,categoryName,categoryImage} = category
    const handleCardClick = ()=>{

    }
  return (
    <Card shadow="sm" isPressable onPress={() => console.log("category pressed")} onClick={handleCardClick}>
        <CardBody className="overflow-visible p-0">
        <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={category.categoryName}
            className="w-full object-cover h-[140px]"
            src={category.categoryImage}
        />
        </CardBody>
        <CardFooter className="text-small justify-between">
        <p className="text-default-500 font-bold">{category.categoryName}</p>
        </CardFooter>
  </Card>
  )
}

export default CategoryCard