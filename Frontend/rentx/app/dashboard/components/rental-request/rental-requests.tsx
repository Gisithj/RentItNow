import { Button } from '@nextui-org/react';
import React from 'react'
import RentalReqest from './rental-request-card';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { connection, subscribeToOffers } from '@/utils/signalrService';

function RentalRequests() {
  const list = [
      {      
        itemId:"1",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        customerId:'1',
        startDate:"2024-03-14",
        endDate:"2024-04-14",
        hours:"5",
        price:20,
        itemImage: "/assets/images/fruit-2.jpeg",        
      },
      {
        itemId:"2",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        customerId:'1',
        startDate:"2024-03-14",
        endDate:"2024-04-14",
        hours:"5",
        price:20,
        itemImage: "/assets/images/fruit-2.jpeg",      
      },
      {
        itemId:"3",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        customerId:'1',
        startDate:"2024-03-14",
        endDate:"2024-04-14",
        hours:"5",
        price:20,
        itemImage: "/assets/images/fruit-2.jpeg",      
      },
      {
        itemId:"4",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        customerId:'1',
        startDate:"2024-03-14",
        endDate:"2024-04-14",
        price:20,
        itemImage: "/assets/images/fruit-2.jpeg",      
      },
      {
        itemId:"5",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        customerId:'1',
        startDate:"2024-03-14",
        endDate:"2024-04-14",
        hours:"5",
        price:20,
        itemImage: "/assets/images/fruit-2.jpeg",      
      },
     
      {
        itemId:"6",
        itemName:"Tangerine",
        itemDescription:"Tangerine",
        customerId:'1',
        startDate:"2024-03-14",
        endDate:"2024-04-14",
        price:20,
        itemImage: "/assets/images/fruit-2.jpeg",      
      }
   
   
  ];
//     let connection = new HubConnectionBuilder()
//     .withUrl("https://localhost:44375/chat", { withCredentials: true })
//     .build();

// connection.start()
//     .then(function () {
//         console.log("connected");
//         connection.invoke("SendRentalRequestToRenter", "31BE38E3-2F0B-4638-BD57-08DC57186DBB","7FA8F11F-8BE2-4B8C-14AE-08DC56CB133A")
//     .catch(err => console.error("Error sending request:", err));
//     })
//     .catch(function (err) {
//         return console.error(err.toString());
//     });

  
// connection.on("SendOffersToUser", function(message) {
//   console.log(message);
// });((
  connection.state == "Connected" && subscribeToOffers((message)=>console.log(message))

  return (
    <div className='w-full flex flex-col gap-4'>
    <div className='flex flex-row justify-between'>
      <h1 className='text-2xl font-bold'>Rental Requests</h1>
    </div>
    <div className='w-full flex flex-col gap-4'>
      {
        list.map((request,index)=>(
          <RentalReqest rentalRequest={request} key={index}/>
        ))
      }
     
    </div>
  </div>
  )
}

export default RentalRequests