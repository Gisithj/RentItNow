import {  Card, CardFooter, CardHeader } from '@nextui-org/card'
import {  Button } from '@nextui-org/button'
import {  Image } from '@nextui-org/image'
import React from 'react'

function HeroCard() {
  return (
    <div>
          <Card isFooterBlurred className="w-full h-[500px] ">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
        <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src="/assets/images/1.jpg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 items-center">
          <Image
            alt="Breathing app icon"
            className="rounded-full w-10 h-11 bg-black"
            src="/images/breathing-app-icon.jpeg"
          />
          <div className="flex flex-col">
            <p className="text-tiny text-white/60">Breathing App</p>
            <p className="text-tiny text-white/60">Get a good night&apos;s sleep.</p>
          </div>
        </div>
        <Button radius="full" size="sm">Get App</Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default HeroCard