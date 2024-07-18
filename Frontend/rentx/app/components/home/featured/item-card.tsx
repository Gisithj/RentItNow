import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardBody, CardFooter, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { debounce, throttle } from 'lodash';
import HoverCard from './hover-card';
import ItemCardCarousel from '@/app/rent-tools/itemcard-carousel/itemCardCarousel';

interface ItemCardProps {
  item: {
    itemId: string;
    itemName: string;
    itemDescription: string;
    imageURLs: string[];
    rentalOptions: { rentalOptionName: string, price: number }[];
    specifications: { specificationFeature: string, featureDetail: string }[];
    isRented: boolean;
    renterId: string;
  };
  isHoverDisabled?: boolean;
}

function ItemCard({ item, isHoverDisabled = false }: ItemCardProps) {
  const { itemId, itemName, imageURLs, rentalOptions, renterId } = item;
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState("");
  const cardRef = useRef(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setIsHoverCardOpen(true);
      setHoveredItemId(itemId);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setIsHoverCardOpen(false);
      setHoveredItemId("");
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  // const handleMouseEnter = throttle(() => {
  //   setIsHoverCardOpen(true);
  //   setHoveredItemId(itemId);
  // }, 300);

  // const handleMouseLeave = throttle(() => {
  //   setIsHoverCardOpen(false);
  //   setHoveredItemId("");
  // }, 300);

  // useEffect(() => {
  //   // Cleanup function to cancel throttled functions on unmount
  //   return () => {
  //     handleMouseEnter.cancel();
  //     handleMouseLeave.cancel();
  //   };
  // }, []);

  return (
    <Popover
      placement="bottom-end"
      isOpen={isHoverCardOpen}
      offset={0}
      backdrop='transparent'
      triggerScaleOnOpen={false}
      shouldCloseOnBlur={true}
    >
      <PopoverTrigger>
        <Card
          shadow="sm"
          className='max-w-[300px]'
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ opacity: "100", backdropFilter: "none" }}
        >
          <CardBody className="overflow-visible p-0">
            <ItemCardCarousel slides={imageURLs} isItemCardCaroselHovered={isHoverCardOpen} itemId={itemId} hoverdItemId={hoveredItemId} />
          </CardBody>
          <CardFooter className="flex flex-col text-small justify-start items-start">
            <p className='text-default-500 font-bold'>{itemName}</p>
            <div className="flex flex-row justify-between w-full items-center">
              <p className="text-default-500 text-xs font-semibold">Rent per day</p>
              <p className="text-xs font-bold">Rs. {item && rentalOptions.find(option => option.rentalOptionName.toLowerCase() === "rent per day")?.price.toFixed(2)}</p>
            </div>
          </CardFooter>
        </Card>
      </PopoverTrigger>
      {!isHoverDisabled &&
        <PopoverContent
          className="p-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <HoverCard itemName={itemName} itemId={itemId} rentalOption={rentalOptions.find(option => option.rentalOptionName === "rent per day")?.price} renter={renterId} />
        </PopoverContent>}
    </Popover>
  );
}

export default ItemCard;
