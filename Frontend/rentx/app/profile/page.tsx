"use client";
import { GET_ITEMS_BY_RENTER_WITH_INCLUDE } from "@/api/item";
import { GET_RENTER_BY_ID } from "@/api/renter";
import { GetItem, Renter } from "@/utils/interfaces";
import { Tabs, Tab, Card, CardBody, Chip, Link, Skeleton, Button, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import { MdOutlineEventAvailable ,MdOutlineEventBusy  } from "react-icons/md";
import { Key } from '@react-types/shared'
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchItemsByRoleId } from "@/lib/features/updateTriggerSlice";
import { useAppDispatch } from "@/lib/hooks";
import Listing from "../dashboard/components/manage-listing/listing";
import ItemCard from "../components/home/featured/item-card";
function Profile() {
  const searchParams = useSearchParams();
  const renterId = searchParams.get("renter");
  const dispatch = useAppDispatch();

  const [renter, setRenter] = useState<Renter | null>(null);
//   const [renterItems, setRenterItems] = useState<>(null);
  const [selected, setSelected] = useState<Key>("all-items");
  const { rentalItemList, status, error } = useSelector((state:RootState) => state.updateTrigger)

  const [allItems, setAllItems] = useState<GetItem[]>([])
  const [rentedItems, setRentedItems] = useState<GetItem[]>([])
  const [availableItems, setAvailableItems] = useState<GetItem[]>([])

  const fetchRenter = async (renterId: string) => {
    try {
      const response = await GET_RENTER_BY_ID(renterId);
      setRenter(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemArrays = async () => {
    setAllItems(rentalItemList)
    console.log(rentalItemList);

    setRentedItems(rentalItemList.filter((item)=>item.isRented))
    setAvailableItems(rentalItemList.filter((item)=>!item.isRented))
    // setRentedItems(rentalItemList.filter((item)=>item.isRented))
    // setAvailableItems(rentalItemList.filter((item)=>!item.isRented))
  };
  useEffect(() => {
    if (renterId) {
      console.log(renterId);

      fetchRenter(renterId);
      dispatch(fetchItemsByRoleId(renterId))
    } else {
      console.log("renterId not found");
    }
  }, [renterId]);

  useEffect(()=>{
    handleItemArrays()
  },[rentalItemList])


  return (
    <div className="px-4 md:px-20 lg:px-44 py-4 md:py-10">
      <div className="flex flex-row">
        <div className="w-full">
          <div className="w-full flex flex-col item-center justify-center gap-4">
            <div className="w-full flex flex-row gap-4 items-center justify-center">
                <div>
                <Card
                isFooterBlurred
                radius="lg"
                className="border-none"
                >
                <Image
                    alt="Woman listing to music"
                    className="object-cover aspect-square"
                    height={200}
                    src={"/assets/images/1.jpg"}
                    width={200}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Online</p>
                    <Button 
                        className="text-tiny text-white bg-black/20" 
                        variant="flat" 
                        color="default" 
                        radius="lg" 
                        size="sm">
                     <a href={renter?.contactNo}>Contact Renter</a>
                    </Button>
                </CardFooter>
                </Card>
                </div>
              <div className="fle felx-col gap-2">
                  <h1 className="text-2xl font-bold">{renter?.renterName}</h1>
                  <div className="flex gap-4">
                    {/* <p className="text-default-500">
                        ContactNo
                      </p> */}
                    <p className="text-default-500">{renter?.contactNo}</p>
                  </div>
                  <div className="flex gap-4">
                    {/* <p className="text-default-500">
                      Address
                      </p> */}
                    <p className="text-default-500">{renter?.renterAddress}</p>
                  </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center align-middle">
              <Tabs
                aria-label="Options"
                selectedKey={selected}
                className="text-center flex items-center"
                onSelectionChange={setSelected}
              >
                <Tab key="all-items" 
                    title={
                    <div className="flex items-center space-x-2">
                    <MdOutlineEventAvailable  size={20}/>
                    <span>All items</span>
                    <Chip size="sm" variant="faded">{rentalItemList && rentalItemList.length}</Chip>
                    </div>
                }>
                  <Card>
                    <CardBody>
                        <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 h-[400px]  overflow-y-auto '>
                            {status.rentalItemList !== 'succeeded' ?
                            Array.from({ length: 16 }).map((_, index) => (
                                <Skeleton key={index} isLoaded={status.rentalItemList !== 'succeeded'} className='rounded-lg'>
                                    <div className="h-52 max-w-[200px] aspect-square bg-default-300"></div>
                                </Skeleton>
                            ))
                            :
                            rentalItemList && 
                            allItems.length>0 ?
                            allItems.map((item:any, index:number) => (
                                // <Skeleton key={index} isLoaded={!itemsLoading}>
                                <Link key={index} href={`/product/${item.itemId}`} className='h-fit'>
                                    <ItemCard item={item} isHoverDisabled={true} />
                                </Link>
                                // </Skeleton>
                            ))
                            :

                            <div className='flex w-full h-full'>
                                <h1 className='text-2xl font-bold'>No items found</h1>
                            </div>
                            }
                        
                        </div>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="rented-items" 
                    title={
                        <div className="flex items-center space-x-2">
                        <MdOutlineEventBusy  size={20}/>
                        <span>Rented-items</span>
                        <Chip size="sm" variant="faded">{rentedItems.length}</Chip>
                        </div>
                    }
                >
                  <Card>
                    <CardBody>
                    <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-2 h-[400px] 2xl:h-[700px] overflow-y-auto '>
                            {status.rentalItemList !== 'succeeded' ?
                            Array.from({ length: 16 }).map((_, index) => (
                                <Skeleton key={index} isLoaded={status.rentalItemList !== 'succeeded'} className='rounded-lg'>
                                    <div className="h-52 max-w-[200px] aspect-square bg-default-300"></div>
                                </Skeleton>
                            ))
                            :
                            rentalItemList && 
                            rentedItems.length>0 ?
                            rentedItems.map((item:any, index:number) => (
                                // <Skeleton key={index} isLoaded={!itemsLoading}>
                                <Link key={index} href={`/product/${item.itemId}`} className='h-fit'>
                                    <ItemCard item={item} isHoverDisabled={true} />
                                </Link>
                                // </Skeleton>
                            ))
                            :

                            <div className='flex w-full h-full'>
                                <h1 className='text-2xl font-bold'>No items found</h1>
                            </div>
                            }
                        
                        </div>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="available-items" 
                    title={
                        <div className="flex items-center space-x-2">
                        <MdOutlineEventAvailable size={20}/>
                        <span>Available items</span>
                        <Chip size="sm" variant="faded">{availableItems.length}</Chip>
                        </div>
                    }
                >
                  <Card>
                    <CardBody>
                    <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-2 h-[400px] 2xl:h-[700px] overflow-y-auto '>
                            {status.rentalItemList !== 'succeeded' ?
                            Array.from({ length: 16 }).map((_, index) => (
                                <Skeleton key={index} isLoaded={status.rentalItemList !== 'succeeded'} className='rounded-lg'>
                                    <div className="h-52 max-w-[200px] aspect-square bg-default-300"></div>
                                </Skeleton>
                            ))
                            :
                            rentalItemList && 
                            availableItems.length>0 ?
                            availableItems.map((item:any, index:number) => (
                                // <Skeleton key={index} isLoaded={!itemsLoading}>
                                <Link key={index} href={`/product/${item.itemId}`} className='h-fit'>
                                    <ItemCard item={item} isHoverDisabled={true}/>
                                </Link>
                                // </Skeleton>
                            ))
                            :

                            <div className='flex w-full h-full'>
                                <h1 className='text-2xl font-bold'>No items found</h1>
                            </div>
                            }
                        
                        </div>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
