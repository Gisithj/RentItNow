"use client";
import { useRouter, useParams } from "next/navigation";
import ProductCarousel from "../carousel/product-images-carousel";
import {
  Button,
  Input,
  Link,
  CircularProgress,
  Select,
  SelectItem,
  Skeleton,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import DateTimePicker from "@/app/components/ui/datetimepicker";
import { GET_ITEM_BY_ID_WITH_INCLUDE, GET_RENTAL_ITEMS_BY_RENTAL_ID, IS_ITEM_AVAIALABLE, RENT_ITEM } from "@/api/item";
import { ChangeEvent, useEffect, useState } from "react";
import { GetItem, Item, RentalItem, Renter } from "@/utils/interfaces";
import { GET_RENTER_BY_ID } from "@/api/renter";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { log } from "console";
import { fetchItemByIdWithInclude } from "@/lib/features/updateTriggerSlice";
import { useAppDispatch } from "@/lib/hooks";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { set } from "date-fns";
import SignIn from "@/app/components/signIn";
import { setActiveChat } from "@/lib/features/chatSlice";
import { CREATE_CHAT } from "@/api/messages";

const ProductPage = ({ params }: { params: { slug: string[]} }) => {
  const productId = params.slug[0];
  const rentalView = params.slug[1] || "false";
  
  console.log(params.slug);
  console.log(productId);
  console.log(rentalView);
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  //redux states
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const { itemWithInclude, status, error } = useSelector(
    (state: RootState) => state.updateTrigger
  );
  //local states
  const [item, setItem] = useState<GetItem | null>(itemWithInclude);
  const [rentalItem, setRentalItem] = useState<RentalItem | null>();
  const [renterDetails, setRenterDetails] = useState<Renter>();
  const [selectedRentalOption, setSelectedRentalOption] = useState<string>(
    itemWithInclude?.rentalOptions[0].rentalOptionName || ""
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>();
  const [hoursCount, setHoursCount] = useState("1");
  const [rentalDurationErrorMessage, setRentalDurationErrorMessage] = useState("");
  const [isDurationError, setIsDurationError] = useState(false);
  const [isItemLoaded, setIsItemLoaded] = useState(false);
  const [isRenterloaded, setIsRenterLoaded] = useState(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isRentConfirmed, setIsRentConfirmed] = useState(false);
  const [isRentStarted, setIsRentStarted] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [isRentFailed, setIsRentFailed] = useState(false);
  const [isItemAvailable, setIsItemAvailable] = useState(false);
  const [initialLoadOver, setInitialLoadOver] = useState(false);
  const [rentalPrice,setRentalPrice] = useState(0);
  //specification arrays
  let firstHalf: any[] = [];
  let secondHalf: any[] = [];

  const handleRentModelOpen = () => {
    onOpen();
    setIsRented(false);
  };
  const today = new Date();
  //handle date selection
  const handleStartDateChange = (date: Date) => {
    if (date < today) {
      handleDurationErrorMessage("Please select a valid date");
    }
    setStartDate(date);
  };

  //handle end date selection
  const handleEndDateChange = (date: Date) => {
    if (date < today) {
      handleDurationErrorMessage("Please select a valid date");
    }
    setEndDate(date);
  };

  //handle hours count
  const handleHours = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("in the hours count handle");
    setHoursCount(e.target.value);
    calculateRental();
  };

  //handle duration error message state
  const handleIsDurationError = () => {
    setIsDurationError(!isDurationError);
  };

  //handle duration error message
  const handleDurationErrorMessage = (message: string) => {
    setRentalDurationErrorMessage(message);
    setIsDurationError(true);
  };
  //create specification arrays
  if (item != null && item.specifications.length > 0) {
    console.log(item);
    
    var middleIndex = Math.ceil(item!.specifications.length / 2);
    firstHalf = item!.specifications.slice(0, middleIndex);
    secondHalf = item!.specifications.slice(middleIndex);
  }

  //handle click rent now
  const handleRentNowClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/sign-in");
    } else {
      setIsRented(false);
      setIsRentFailed(false);
      setIsRentConfirmed(true);
      const rentItem = {
        itemId: productId,
        rentalStartDate: startDate!.toISOString(),
        rentalEndDate: endDate? endDate.toISOString():startDate!.toISOString(),
        hours: hoursCount ? parseInt(hoursCount) : null,
        rentalPrice: rentalPrice,
        rentalOptionId: item!.rentalOptions.find(
          (option) =>
            option.rentalOptionName.toLowerCase() ===
            selectedRentalOption.toLowerCase()
        )?.id!,
        customerId: user!.roleId,
        renterId: item!.renterId,
      };
      // try {
        RENT_ITEM(rentItem)
          .then((response) => {
            dispatch(fetchItemByIdWithInclude(productId as string));
            setRenterDetails(response);
            console.log(response);
          })
          .catch((error) => {
            setIsRentFailed(true);
            console.error(error);
          })
          .finally(() => {
            console.log("in the finally",isRentFailed);
            
            setIsRented(true);
            setIsRentStarted(false);
            setIsRentConfirmed(false);
          });
      // } catch (error) {
      //   setIsRentFailed(true);
      //   console.error(error);
      // }
    }


  };

  const getDays = (endDate: Date, startDate: Date) => {
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  //calculate rental
  const calculateRental = () => {
    let price;
    if (!item) return 0;
    if (selectedRentalOption.toLowerCase() !== "rent per hour") {
      if (!startDate || !endDate) return 0;
      if (startDate > endDate) return 0;
    }

    if (selectedRentalOption.toLowerCase() === "rent per hour") {
      if (parseInt(hoursCount) > 24) {
        if (!isDurationError) {
          handleDurationErrorMessage(
            "Duration cannot be more than 24 hours on hourly rental option"
          );
        }
        return;
      } else {
        if (isDurationError) {
          handleIsDurationError();
        }
        price = "Rs." +
          (
            item.rentalOptions.find(
              (option) =>
                option.rentalOptionName.toLowerCase() ===
                selectedRentalOption.toLowerCase()
            )?.price! * parseInt(hoursCount)
          ).toFixed(2);
          console.log(price);
          
        setRentalPrice(parseFloat(price.split("Rs.")[1]));
        return (
          price
        );
      }
    } else if (selectedRentalOption.toLowerCase() === "rent per day") {
      if (getDays(endDate!, startDate!) > 7) {
        if (!isDurationError) {
          handleDurationErrorMessage(
            "Duration cannot be more than 7 days on daily rental option"
          );
        }
        return "Rs.0.00";
      } else {
        if (isDurationError) {
          handleIsDurationError();
        }
        const noOfDays = getDays(endDate!, startDate!);
        price =
          "Rs." +
          (
            item.rentalOptions.find(
              (option) =>
                option.rentalOptionName.toLowerCase() ===
                selectedRentalOption.toLowerCase()
            )?.price! * noOfDays
          ).toFixed(2)
        ;
        setRentalPrice(parseFloat(price.split("Rs.")[1]));
        return (
          price
        );
      }
    } else if (selectedRentalOption.toLowerCase() === "rent per week") {
      if (getDays(endDate!, startDate!) < 7) {
        if (!isDurationError) {
          handleDurationErrorMessage(
            "Duration cannot be less than 7 days on weekly rental option"
          );
        }
        return "Rs.0.00";
      } else {
        if (isDurationError) {
          handleIsDurationError();
        }
        const noOfWeeks = getDays(endDate!, startDate!) / 7;
        price =
          "Rs." +
          (
            item.rentalOptions.find(
              (option) =>
                option.rentalOptionName.toLowerCase() ===
                selectedRentalOption.toLowerCase()
            )?.price! * noOfWeeks
          ).toFixed(2)
        ;
        setRentalPrice(parseFloat(price.split("Rs.")[1]));
        return (
          price
        );
      }
    } else if (selectedRentalOption.toLowerCase() === "rent per month") {
      if (getDays(endDate!, startDate!) < 30) {
        if (!isDurationError) {
          handleDurationErrorMessage(
            "Duration cannot be less than 30 days on monthly rental option"
          );
        }
        return;
      } else {
        if (isDurationError) {
          handleIsDurationError();
        }
        const noOfMonth = getDays(endDate!, startDate!) / 30;
        price =
          "Rs." +
          (
            item.rentalOptions.find(
              (option) =>
                option.rentalOptionName.toLowerCase() ===
                selectedRentalOption.toLowerCase()
            )?.price! * noOfMonth
          ).toFixed(2)
        ;
        setRentalPrice(parseFloat(price.split("Rs.")[1]));
        return (
          price
        );
      }
    }
  };

  //handle rental option change
  const onRentalOptionChange = (e: any) => {
    setSelectedRentalOption(e.target.value);
  };

  //go into the renter profile
  const handleRenterProfileClick = (renterId: string) => {
    router.push(`/profile?renter=${renterId}`);
  };
  const handleRenterChatClick = async () => {
    console.log("in the chat click");
    
    try {
      if(!user || !renterDetails) return;
      console.log("user",user);
      console.log("renter",renterDetails);
      
      const chat = await CREATE_CHAT({senderId:user.id,receiverId:renterDetails.userId});
      dispatch(setActiveChat(chat));
    } catch (error) {
      console.log("error creating chat",error);      
    }
    router.push('/chat');
  };

  useEffect(() => {
    //get the renter details
    const getRenter = async () => {   
      console.log("in the get renter");
      
      if(rentalView){
        item && GET_RENTER_BY_ID(item!.renterId)
        .then((response) => {
          setRenterDetails(response);
          console.log("Renter");
          setIsRenterLoaded(true);
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      }else{
        itemWithInclude && GET_RENTER_BY_ID(itemWithInclude!.renterId)
        .then((response) => {
          setRenterDetails(response);
          console.log("Renter");
          setIsRenterLoaded(true);
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
    //get the item details
    const getItem = async () => {
      dispatch(fetchItemByIdWithInclude(productId as string))
        .then((response) => {
          console.log("in the get item");
          console.log(response);
          if (itemWithInclude && status.itemWithInclude === "succeeded") {
            console.log("in the item with include");
            console.log(itemWithInclude);

            setItem(itemWithInclude);
            setSelectedRentalOption(
              itemWithInclude.rentalOptions[0].rentalOptionName
            );
            setIsItemLoaded(true);
            console.log("item loaded");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    console.log(productId);  
    console.log(isItemLoaded);      
    if (!isItemLoaded) {
      console.log(rentalView);
      setIsItemLoaded(false);
      (rentalView === "false") && getItem();
      
    }
    getRenter();
    
  }, [itemWithInclude, rentalView,isItemLoaded]);

  useEffect(() => {    
    const isItemAvailable = async () => {
      
      setInitialLoadOver(true);
      console.log(startDate);
      
      
      if(!endDate){
        await IS_ITEM_AVAIALABLE(productId, startDate!.toISOString(), startDate!.toISOString()).then((response) => {
          console.log(response);
          setIsItemAvailable(response)
          
        });
      }else{
        await IS_ITEM_AVAIALABLE(productId, startDate!.toISOString(), endDate.toISOString()).then((response) => {
          console.log(response);
          setIsItemAvailable(response)
          
        });
      }
    };
    (rentalView==="false") && isItemAvailable();
  },[startDate,endDate,productId])

  useEffect(() => {
    // Ensure all conditions are met before calling calculateRental
    if (startDate && selectedRentalOption) {
      calculateRental();
    }
  }, [startDate, endDate, selectedRentalOption,hoursCount]);

  useEffect(()=>{
    
    if(rentalView==="true"){
      console.log("in the rental view");
      
       GET_RENTAL_ITEMS_BY_RENTAL_ID(productId).then((response) => {
        console.log("gggg");
        setRentalItem(response)
        setItem(response.item);
        setIsItemLoaded(true);
        console.log(response);        
      })
    }
  },[rentalView,productId])

  return (
    <div className="px-4 md:px-20 lg:px-44 py-4 md:py-10">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="w-full">
            {isItemLoaded ? (
              item && (
                <ProductCarousel images={item!.imageURLs} />
              )
            ) : (
              <Skeleton className="rounded-lg">
                <div className="h-[400px] aspect-square bg-default-300"></div>
              </Skeleton>
            )}
          </div>
          <div className="flex flex-col gap-2 items-start">
            <Skeleton isLoaded={isItemLoaded} className="max-w-xs h-3 " />
            <h1 className="text-4xl font-bold">{item?.itemName}</h1>
            {isRenterloaded ? (
              renterDetails && (
                <User
                  onClick={() =>
                    handleRenterProfileClick(item!.renterId)
                  }
                  name={renterDetails?.renterName}
                  className="cursor-pointer"
                  description={
                    <Link size="sm" onPress={handleRenterChatClick} >
                      @{renterDetails && renterDetails?.renterName}
                    </Link>
                  }
                  avatarProps={{
                    size: "sm",
                    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                  }}
                />
              )
            ) : (
              <div className="max-w-[300px] w-full flex items-center gap-3">
                <div>
                  <Skeleton className="flex rounded-full w-12 h-12" />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-1/5 rounded-lg" />
                  <Skeleton className="h-3 w-2/5 rounded-lg" />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 w-full">
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
              <p>{item?.itemDescription}</p>
              {item && (
                (rentalView==="false") &&

                <Select
                  size="sm"
                  label="Select a rent option"
                  className="max-w-xs"
                  selectionMode="single"
                  defaultSelectedKeys={["Rent per hour"]}
                  onChange={onRentalOptionChange}
                >
                  {item.rentalOptions.map((rentOption) => (
                    <SelectItem
                      key={rentOption.rentalOptionName}
                      value={rentOption.rentalOptionName}
                    >
                      {rentOption.rentalOptionName}
                    </SelectItem>
                  ))}
                </Select>
              )}
              {rentalView==="true" ? 
              <div>{item?.rentalOptions.find(()=>rentalItem?.rentalOptionId)?.rentalOptionName}</div>
            :
            selectedRentalOption.toLowerCase() === "rent per hour" ? (
              <>
                <div>
                  <Input
                    type="email"
                    label="No of hours"
                    placeholder="Enter no of hours"
                    value={hoursCount}
                    className="max-w-xs"
                    onChange={(e) => handleHours(e)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div>
                    <h1 className="text-sm">Date</h1>
                    <DateTimePicker onDateChange={handleStartDateChange} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <h1 className="text-sm">From</h1>
                  <DateTimePicker onDateChange={handleStartDateChange} />
                </div>
                <div>
                  <h1 className="text-sm">To</h1>
                  <DateTimePicker onDateChange={handleEndDateChange} />
                </div>
              </div>
            )}

              {isDurationError && (
                <span className="text-sm font-normal text-danger-500">
                  {rentalDurationErrorMessage}
                </span>
              )}

              <span className="text-2xl font-bold">{`Rs.${rentalView==="true"?rentalItem?.rentalPrice:rentalPrice.toFixed(2)}`}</span>

              {rentalView==="false" && 
                (!isItemAvailable ? (
                  !initialLoadOver ? (
                  "Select the dates to check availability"
                  ) : (
                  "Item Not available for renting right now"
                  )
                ) : (
                  <Button onPress={handleRentModelOpen}>Rent Now</Button>
                ))
              }
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold">Product overview</span>
          <p>{item?.itemOverview}</p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold">Product Specifications</span>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Table
              isStriped
              hideHeader
              aria-label="Example static collection table"
              className="w-full"
            >
              <TableHeader>
                <TableColumn>Feature</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                {item ? (
                  firstHalf.map((specification, index) => (
                    <TableRow key={index} className="border-b-slate-800">
                      <TableCell>
                        {specification.specificationFeature}
                      </TableCell>
                      <TableCell className="text-end">
                        {specification.featureDetail}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="2">
                    <TableCell>Maximum air speed (mph)</TableCell>
                    <TableCell className="text-end">120</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Table
              isStriped
              hideHeader
              aria-label="Example static collection table"
              className="w-full"
            >
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
              </TableHeader>
              <TableBody>
                {item && secondHalf.length > 0 ? (
                  secondHalf.map((specification, index) => (
                    <TableRow key={index} className="border-b-slate-800">
                      <TableCell>
                        {specification.specificationFeature}
                      </TableCell>
                      <TableCell className="text-end">
                        {specification.featureDetail}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="2">
                    <TableCell>Maximum air speed (mph)</TableCell>
                    <TableCell className="text-end">120</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {isLoggedIn ?
      <Modal
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1" />
              <ModalBody className="flex flex-col items-center text-center">
                {!isRentConfirmed && !isRented ? (
                  <>
                    <h1 className="text-xl font-medium">
                      Please confirm your request to rent this item?
                    </h1>
                  </>
                ) : !isRented ? (
                  <CircularProgress
                    color="default"
                    aria-label={"Renting the item..."}
                  />
                ) : (
                  !isRentFailed?
                  <>
                    <FaCircleCheck fontSize={30} className="text-success" />

                    <h1 className="text-xl font-medium">
                      {!isRented
                        ? "Renting the item..."
                        : "Your item is rented successfully!!"}
                    </h1>
                  </>
                  :
                  <>
                    <FaCircleXmark fontSize={30} className="text-danger" />

                    <h1 className="text-xl font-medium">
                      Your renting failed. Please try again
                    </h1>
                  </>
                )}
              </ModalBody>
              <ModalFooter className="flex flex-col items-center text-center">
                {!isRentConfirmed && !isRented ? (
                  <div className="flex gap-2">
                    <Button color="danger" variant="bordered" onPress={onClose}>
                      No
                    </Button>
                    <Button
                      color="danger"
                      variant="solid"
                      onPress={() => handleRentNowClick()}
                    >
                      Confirm Renting
                    </Button>
                  </div>
                ) : (
                  <Button color="primary" variant="solid" onPress={onClose}>
                    Return to listings
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      :
      <Modal 
        backdrop="blur" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        
      >
        <ModalContent>
          <SignIn onClose={onClose}/>
        </ModalContent>
      </Modal>
      }
      
    </div>
  );
};

export default ProductPage;
