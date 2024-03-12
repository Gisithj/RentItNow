"use client";
import {
  Listbox,
  ListboxSection,
  ListboxItem,
  Slider,
  Chip,
  Divider,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FilterChip } from "./filter-chip";

function CatelogSidebar() {
  const handleAccountSettingsClick = () => {};
  const power_tool_categories = [
    "Drilling",
    "Cutting",
    "Sanding",
    "Grinding",
    "Fastening",
    "Routing",
    "Planing",
    "Heating",
    "Nailing",
    "Jointing",
    "Sawing",
    "Polishing",
    "Finishing",
    "Cleaning",
    "Painting",
    "Measuring",
    "Welding",
    "Compressing",
    "Power Generation",
    "Turning",
    "Milling",
    "Pressing",
    "Sharpening",
  ];
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
  const [selected, setSelected] = useState<String[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<String[]>([]);
  const [groupSelected, setGroupSelected] = React.useState([]);
  const handleFilterClick = (value:any) =>{
    if(selectedFilters.includes(value)){
        console.log("asdasd");
        
        setSelectedFilters(selectedFilters.filter(item => item !== value));
    }else{
        setSelectedFilters([...selectedFilters,value])
    }
    console.log(value);
    
    // setSelectedFilters(value)
  }
  const handleBrandSelect = (value:any) =>{
    setSelected(value)
  }

  useEffect(()=>{
    console.log(selected);
    console.log(selectedFilters);
  },[selected,selectedFilters])
  return (
    <div className="w-full max-w-[260px] h-fit border-small px-8 py-4 rounded-small border-default-200 dark:border-default-100">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-light">Categories</span>
        <div className="flex flex-wrap gap-1">
        <CheckboxGroup
        className="gap-1"
        orientation="horizontal"
        onValueChange={(value)=>handleFilterClick(value)}
        
      >
          {power_tool_categories.map((category, _index) => (
                <FilterChip value={category} key={_index} handleFilterClick={handleFilterClick}>
                     {category}
                </FilterChip>
            

          ))}
          </CheckboxGroup>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-light">Price</span>
        <Slider
          size="sm"
          step={0.01}
          maxValue={1}
          minValue={0}
          aria-label="Temperature"
          defaultValue={0.2}
          className="max-w-md"
        />
      </div>
      <Divider className="my-4" />
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
      </div>
    </div>
  );
}

export default CatelogSidebar;
