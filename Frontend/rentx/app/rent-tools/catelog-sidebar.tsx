"use client";
import {
  Divider,
  Checkbox,
  CheckboxGroup,
  DateRangePicker
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { FilterChip } from "./filter-chip";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { set } from "date-fns";
import {parseDateTime, getLocalTimeZone,today} from "@internationalized/date";
import { setIsNotRented, setSelectedCategories, setAvailabilityDateRange} from "@/lib/features/filterSlice";
import {RangeValue} from "@react-types/shared";
import {DateValue} from "@react-types/datepicker";
function CatelogSidebar({handleIsAvailabilityChecking}: { handleIsAvailabilityChecking: () => void}){
  const power_tool_categories = ["Gardening", "Construction", "Woodworking", "Plumbing", "Electrical", "Automotive", "Painting", "Cleaning","Home Improvement"]
  const power_tool_brands = [
    "DeWalt",
    "Makita",
    "Bosch",
    "Milwaukee",
    "Ryobi",
    "Hilti",
    "Black & Decker",
    "Stanley",
    "Hitachi",
    "Craftsman",
    "RIDGID",
    "Metabo",
    "Kobalt",
  ];
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true);
  const [selectedStartDate, setSelectedStartDate] = useState<RangeValue<DateValue>>({
    start: parseDateTime(today(getLocalTimeZone()).toString()),
    end: parseDateTime(today(getLocalTimeZone()).add({days:1}).toString()),
  });
  const {selectedCategories} = useSelector((state:RootState) => state.filterSlice);
  const isNotRented = useSelector((state:RootState) => state.filterSlice.isNotRented);
  const handleIsNotRentedChange = () =>{
    // if(isNotRented){
    //   console.log("in true");
      
      dispatch(setIsNotRented(!isNotRented));
    // }else{
    //   console.log("in false");
    //   dispatch(setIsNotRented(true));
    // }
  }
  const handleAvailabilityDateRangeChange = () =>{
      dispatch(setAvailabilityDateRange({
        startDate: new Date(selectedStartDate.start.toString()).toISOString(),
        endDate:new Date(selectedStartDate.end.toString()).toISOString()}));
  }
  const handleCategoryChange = (selectedCategories: string[]) => {
    // Dispatch an action with the selected categories as payload
    dispatch(setSelectedCategories(selectedCategories));
    console.log("dispatched categories");
    
  };

  useEffect(()=>{
    if (isFirstRender.current) {
      isFirstRender.current = false; // After the first render, set this to false
    } else {
      // Not the first render, so safe to call these functions
      handleIsAvailabilityChecking();
      handleAvailabilityDateRangeChange();
    }
  },[selectedStartDate])

  return (
    <div className="w-full max-w-[280px] h-fit border-small px-4 py-4 rounded-small border-default-200 dark:border-default-100">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-light">Categories</span>
        <div className="flex flex-wrap gap-1">
        <CheckboxGroup
        className="gap-1"
        orientation="horizontal"
        onValueChange={handleCategoryChange}
        
      >
          {power_tool_categories.map((category, index) => (
                <FilterChip value={category} key={index}>
                     {category}
                </FilterChip>
            

          ))}
          </CheckboxGroup>
        </div>
      </div>
      <Divider className="my-4" />
      <Checkbox isSelected={isNotRented} onValueChange={handleIsNotRentedChange} size="sm">
        Available for Rent
      </Checkbox>
      <Divider className="my-4" />
      <div className="flex flex-col gap-2">
      <span className="text-xs font-light">Check availability</span>
      <DateRangePicker
          size="sm"
          variant="faded"
          className="text-sm"
          value={selectedStartDate}
          minValue={today(getLocalTimeZone())}
          granularity="day"
          label=""
          description="Enter the date range"
          onChange={setSelectedStartDate}
        />
      </div>
      {/* <Divider className="my-4" />
      <div>
        <span className="text-xs font-light">Brands</span>
        <CheckboxGroup
            onValueChange={(value)=>handleBrandSelect(value)}
            defaultValue={["Hilti"]}
            >
          {power_tool_brands.map((brand, _index) => (
            <Checkbox size="sm" value={brand} key={_index} className="text-xs">
              {brand}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div> */}
    </div>
  );
}

export default CatelogSidebar;
