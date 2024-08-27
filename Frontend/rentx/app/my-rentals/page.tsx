"use client";
import { GET_ALL_RENTAL_ITEMS_BY_CUSTOMER_ID } from "@/api/item";
import { CustomerRentalItem } from "@/utils/interfaces";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import RentalsTable from "../dashboard/components/customer-rentals/rental-row";
function MyRentals() {

  const router = useRouter()
  const { user, isLoggedIn } = useSelector((state:RootState) => state.auth)
  const [rentalItems, setRentalItems] = useState<CustomerRentalItem[]>([]);

  const rentals = async () => {
    if(user){
      try {
        const response = await GET_ALL_RENTAL_ITEMS_BY_CUSTOMER_ID(user?.roleId);
        setRentalItems(response);
        
      } catch (error) {
        console.error(error);
      }
    }else{
      console.log("user not found");
    }
    
  };

  useEffect(() => {    
    if (isLoggedIn && user?.roleId) {
      rentals();
    } else {
      router.push("/rent-tools")
    }
  }, [user,isLoggedIn]);



  return (
    <div className="px-4 md:px-20 lg:px-44 py-4 md:py-6">
      <div className="flex flex-row">
        <div className="w-full">
          <div className="w-full flex flex-col item-center justify-center gap-4">
              <RentalsTable rentalItems={rentalItems}/>
        
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRentals;
