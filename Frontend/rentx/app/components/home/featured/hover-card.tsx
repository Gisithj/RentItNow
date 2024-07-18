import { Button, Card, CardHeader, Avatar, CardBody, CardFooter } from '@nextui-org/react';
import Link from 'next/link';
import React, { useState } from 'react'

interface HoverCardProps{
  itemName:string
  rentalOption:number|undefined
  renter:string
  itemId:string
}
function HoverCard({itemName,rentalOption,renter,itemId}:HoverCardProps) {

  return (
    <Card shadow="none" className="max-w-[235px] rounded-none border-none bg-transparent">
    <CardBody className="flex flex-row gap-3 p-3">
       <Button
        as={Link}
        className={"text-xs p-4"}
        color="primary"
        radius="full"
        size="sm"
        variant={"bordered"}
        href={`/profile?renter=${renter}`}
      >
        Visit the store
      </Button>
      <Button
        as={Link}
        className={"text-xs p-4"}
        color="primary"
        radius="full"
        size="sm"
        variant={"solid"}
        href={`/product/${itemId}`}
      >
        View Product
      </Button>
    </CardBody>
  </Card>
  )
}

export default HoverCard