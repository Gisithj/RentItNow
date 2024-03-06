import React from 'react'
import CategoryCard from './category-card';

function PopularCategories() {
  const list = [
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
   
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
   
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
   
    {
      categoryId:"1",
      categoryName:"Tangerine",
      categoryTitle:"Tangerine",
      categoryImage: "/assets/images/fruit-2.jpeg",
    },
   
  ];
  return (
    <div className="flex flex-col gap-4">
    <div>
      <span className='text-2xl font-bold'>Poplar categories</span>
    </div>
    <div className='gap-2 grid grid-cols-2 sm:grid-cols-4'>
      {list.map((category, index) => (
       <CategoryCard category={category} key={index}/>
      ))}
    </div>
  </div>
  )
}

export default PopularCategories