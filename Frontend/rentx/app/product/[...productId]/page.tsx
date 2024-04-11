"use client";
import { useRouter, useParams } from "next/navigation";
import ProductCarousel from "../carousel/product-images-carousel";
import { Button, Input, Link, Select, SelectItem, Skeleton, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import DateTimePicker from "@/app/components/ui/datetimepicker";
import { connection, sendRentalRequestToRenter, startConnection } from "@/utils/signalrService";
import { GET_ITEM_BY_ID_WITH_INCLUDE } from "@/api/item";
import { ChangeEvent, useEffect, useState } from "react";
import { Item, Renter } from "@/utils/interfaces";
import { GET_RENTER_BY_ID } from "@/api/renter";
import { set, setHours } from "date-fns";

const ProductPage = ({ params }: { params: { productId: string } }) => {

  const { productId } = useParams();

  //redux states
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);

  //local states
  const [item, setItem] = useState<Item>();
  const [renterDetails, setRenterDetails] = useState<Renter>();
  const [selectedRentalOption, setSelectedRentalOption] = useState<string>(item?.rentalOptions[0].rentalOptionName||"");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [hoursCount, setHoursCount] = useState("1");
  const [rentalDurationErrorMessage, setRentalDurationErrorMessage] = useState("");
  const [isDurationError, setIsDurationError] = useState(false);
  let firstHalf: any[] = [];
  let secondHalf: any[]  = [];

  const today = new Date();
  //handle date selection
  const handleStartDateChange = (date: Date) => {    
    
    if(date<today){
     handleDurationErrorMessage("Please select a valid date") 
    }
    setStartDate(date);
  };
  const handleEndDateChange = (date: Date) => {
    if(date<today){
      handleDurationErrorMessage("Please select a valid date") 
    }
    setEndDate(date);
  };

  const handleHours = (e: ChangeEvent<HTMLInputElement>) =>{
    console.log("in the hours count handle");    
    setHoursCount(e.target.value)
    calculateRental
  }
  //get the renter details
  const getRenterDetails = ()=>{
    item  && !renterDetails &&
    GET_RENTER_BY_ID(item!.renterId).then((response) => {
        setRenterDetails(response);
        
    }).catch((error) => {
      console.error(error);
    });
  }
  
  //handle duration error message state
  const handleIsDurationError = () => {
    setIsDurationError(!isDurationError);
  }

  //handle duration error message
  const handleDurationErrorMessage = (message: string) => {
    setRentalDurationErrorMessage(message);
    setIsDurationError(true);
  }
  //create specification arrays
  if(item != null || undefined){
    var middleIndex = Math.ceil(item!.specifications.length / 2);
     firstHalf = item!.specifications.slice(0, middleIndex);
     secondHalf = item!.specifications.slice(middleIndex);
  }

  //handle click rent now
  const handleRentNowClick = () =>{
    console.log(connection);
    
    // startConnection();
    sendRentalRequestToRenter(productId,user?.roleId);
    if(isLoggedIn){
      console.log("logged in");      
    }else{
      console.log("not logged in")
    }
  } 
  
  const getDays = (endDate: Date, startDate: Date) => {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  //calculate rental
  const calculateRental = () => {
    console.log("in the calculateRental");
    console.log(selectedRentalOption.toLowerCase());
    if(!item) return 0;
    if(selectedRentalOption.toLowerCase() !== "rent per hour"){
      if(!startDate || !endDate) return 0;
      if(startDate > endDate) return 0;
    }
    

    if(selectedRentalOption.toLowerCase() === "rent per hour"){
      console.log("in the hours");
      
      if(parseInt(hoursCount)>24){
        if(!isDurationError){
        handleDurationErrorMessage("Duration cannot be more than 24 hours on hourly rental option");
        }
        return;
      }else{   
        if(isDurationError){ 
        handleIsDurationError();
        }
        return "Rs."+(item.rentalOptions.find((option) => option.rentalOptionName.toLowerCase() === selectedRentalOption.toLowerCase())?.price! * parseInt(hoursCount)).toFixed(2);
      }
      
    }else if(selectedRentalOption.toLowerCase()==="rent per day"){
      if(getDays(endDate!,startDate!) > 7){
        if(!isDurationError){
          handleDurationErrorMessage("Duration cannot be more than 7 days on daily rental option");
        }
        return;
      }else{
        if(isDurationError){
          handleIsDurationError();
        }
        const noOfDays = getDays(endDate!,startDate!);
        return "Rs."+(item.rentalOptions.find((option) => option.rentalOptionName.toLowerCase() === selectedRentalOption.toLowerCase())?.price! * noOfDays).toFixed(2);
      }
    }else if(selectedRentalOption.toLowerCase()==="rent per week"){
      if(getDays(endDate!,startDate!) < 7){
        if(!isDurationError){
          handleDurationErrorMessage("Duration cannot be less than 7 days on weekly rental option");
        }
        return;
      }else{
        if(isDurationError){
          handleIsDurationError();
        }
        const noOfWeeks = getDays(endDate!,startDate!)/7;
        return "Rs."+(item.rentalOptions.find((option) => option.rentalOptionName.toLowerCase() === selectedRentalOption.toLowerCase())?.price! * noOfWeeks).toFixed(2);
      }
     
    }else if(selectedRentalOption.toLowerCase()==="rent per month"){
      if(getDays(endDate!,startDate!) < 30){
        if(!isDurationError){
          handleDurationErrorMessage("Duration cannot be less than 30 days on monthly rental option");
        }
        return;
      }else{
        if(isDurationError){
          handleIsDurationError();
        }
        const noOfMonth = getDays(endDate!,startDate!)/30;      
      return "Rs."+(item.rentalOptions.find((option) => option.rentalOptionName.toLowerCase() === selectedRentalOption.toLowerCase())?.price! * noOfMonth).toFixed(2);
      }
      
    }
   
  };

  //handle rental option change
  const onRentalOptionChange = (e:any) =>{
    setSelectedRentalOption(e.target.value);  
  }


  useEffect(() => {
    if(!item){
      GET_ITEM_BY_ID_WITH_INCLUDE(productId as string).then((response) => {
        setItem(response);
        setSelectedRentalOption(response.rentalOptions[0].rentalOptionName)
        getRenterDetails();
      }).catch((error) => {
        console.error(error);
      });
     
    }
    
  }, []);

  return (
      <div className="px-4 md:px-20 lg:px-44 py-4 md:py-10">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="w-full">
              {item && <ProductCarousel images={item!.imageURLs}/>}
            </div>
            <div className="flex flex-col gap-2 items-start">
              <h1 className="text-4xl font-bold">{item?.itemName}</h1>
              <h1 className="text-4xl font-bold">{renterDetails && renterDetails?.renterName}</h1>
              {renterDetails && <User
                name={renterDetails?.renterName}
                description={
                  <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
                    @{renterDetails && renterDetails?.renterName}
                  </Link>
                }
                avatarProps={{
                  size: "sm",
                  src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                }}
              />
              }
              <div className="flex flex-col gap-4">
                {/* <div className="grid grid-cols-2">
                  <div>
                    <ul>
                      <li>Model</li>
                      <li>Make</li>
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li>Inco</li>
                      <li>2018</li>
                    </ul>
                  </div>
                </div> */}
                <p>
                  {item?.itemDescription}
                </p>
                {item && 
                <Select
                  size="sm"
                  label="Select a rent option"
                  className="max-w-xs"
                  selectionMode="single"
                  defaultSelectedKeys={["Rent per hour"]}
                  onChange={onRentalOptionChange}
                >
                   {item.rentalOptions.map((rentOption) => (
                  <SelectItem key={rentOption.rentalOptionName} value={rentOption.rentalOptionName} >
                    {rentOption.rentalOptionName}
                  </SelectItem>
                ))}

                </Select>
                  }
                {selectedRentalOption.toLowerCase()==="rent per hour"?
                  <div>
                      <Input 
                        type="email" 
                        label="No of hours"
                        placeholder="Enter no of hours"
                        value={hoursCount}
                        onChange={(e)=>handleHours(e)} 
                        />
                  </div>
                  :
                  <div className="flex flex-col md:flex-row gap-4">
                    <div>
                      <h1 className="text-sm">From</h1>
                      <DateTimePicker onDateChange={handleStartDateChange}/>
                    </div>
                    <div>
                      <h1 className="text-sm">To</h1>
                      <DateTimePicker onDateChange={handleEndDateChange}/>
                    </div>
                  </div>
                }
                {isDurationError && 
                  <span className="text-sm font-normal text-danger-500">{rentalDurationErrorMessage}</span>
                }
                <span className="text-2xl font-bold">{calculateRental()}</span>
                <Button onPress={handleRentNowClick}>Rent Now</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-bold">Product overview</span>
            <p>
            {item?.itemOverview}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-bold">Product Specifications</span>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <Table isStriped hideHeader aria-label="Example static collection table" className='w-full'>
                              <TableHeader>
                                  <TableColumn>Feature</TableColumn>
                                  <TableColumn>Value</TableColumn>
                              </TableHeader>
                              <TableBody>
                                  {
                                    item?
                                    firstHalf.map((specification,index) => (

                                      <TableRow key={index} className='border-b-slate-800'>
                                        <TableCell>{specification.specificationFeature}</TableCell>
                                        <TableCell className='text-end'>{specification.featureDetail}</TableCell>
                                      </TableRow>
                                    ))
                                    :
                                    <TableRow key="2">
                                    <TableCell>Maximum air speed (mph)</TableCell>
                                    <TableCell className='text-end'>120</TableCell>
                                </TableRow>
                                  }
                                
                              </TableBody>
              </Table>
              <Table isStriped hideHeader aria-label="Example static collection table" className='w-full'>
                              <TableHeader>
                                  <TableColumn>NAME</TableColumn>
                                  <TableColumn>ROLE</TableColumn>
                              </TableHeader>
                              <TableBody>
                              {
                                    item && secondHalf.length>0?
                                    secondHalf.map((specification,index) => (

                                      <TableRow key={index} className='border-b-slate-800'>
                                        <TableCell>{specification.specificationFeature}</TableCell>
                                        <TableCell className='text-end'>{specification.featureDetail}</TableCell>
                                      </TableRow>
                                    ))
                                    :
                                    <TableRow key="2">
                                    <TableCell>Maximum air speed (mph)</TableCell>
                                    <TableCell className='text-end'>120</TableCell>
                                </TableRow>
                                  }
                              </TableBody>
              </Table>
            </div>
          </div>
        </div>
    </div>
    
  );
};

export default ProductPage;
