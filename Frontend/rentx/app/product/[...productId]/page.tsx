"use client";
import { useRouter, useParams } from "next/navigation";
import ProductCarousel from "../carousel/product-images-carousel";
import { Button, Link, Select, SelectItem, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const ProductPage = ({ params }: { params: { productId: string } }) => {
  const router = useRouter();
  const { productId } = useParams();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const rentOptions = [
    {
      label: "Rent per hour",
      value: "r1",
      description: "The second most popular pet in the world",
    },
    {
      label: "Rent per day",
      value: "r2",
      description: "The most popular pet in the world",
    },
    {
      label: "Rent per week",
      value: "r3",
      description: "The most popular pet in the world",
    },
    {
      label: "Rent per month",
      value: "r4",
      description: "The most popular pet in the world",
    },
  ];
  const handleRentNowClick = () =>{
    if(isLoggedIn){
      console.log("logged in");      
    }else{
      console.log("not logged in")
    }
  }
  // Render product details
  return (
    <div className="px-4 md:px-20 lg:px-44 py-4 md:py-10">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="w-full">
            <ProductCarousel />
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h1 className="text-4xl font-bold">Angle Grinder</h1>
            <User
              name="Rent House"
              description={
                <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
                  @RentHouse
                </Link>
              }
              avatarProps={{
                size: "sm",
                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
              }}
            />
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2">
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
              </div>
              <p>
                n angle grinder, also known as a disc grinder or side grinder, is
                a handheld power tool used for cutting, grinding, and polishing
                various materials such as metal, ceramic, and masonry. Here are
                some key points about angle grinders
              </p>
              <Select
                size="sm"
                label="Select a rent option"
                className="max-w-xs"
                selectionMode="single"
              >
                {rentOptions.map((rentOption) => (
                  <SelectItem key={rentOption.value} value={rentOption.value}>
                    {rentOption.label}
                  </SelectItem>
                ))}
              </Select>
              <span className="text-2xl font-bold">Rs.3000.00</span>
              <Button onPress={handleRentNowClick}>Rent Now</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold">Product overview</span>
          <p>
          Delivers up to 28 minutes of run time at mid-speed (15,800 RPM) using two 5.0Ah batteries.
        Zero emissions and reduced maintenance; no need for gas or oil
        Delivers up to 28-minutes of run time at mid-speed (15,800 RPM) using two 5.0 Ah batteries
        6-stage air velocity/volume selection dial with variable speed control trigger
        Delivers up to 120 MPH air velocity and 473 CFM of air volume
        Sound pressure rating of 61 dB(A); measured per ANSI B 175.2 standard
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
                                <TableRow key="1" className='border-b-slate-800'>
                                    <TableCell>Color</TableCell>
                                    <TableCell className='text-end'>Teal</TableCell>
                                </TableRow>
                                <TableRow key="2">
                                    <TableCell>Maximum air speed (mph)</TableCell>
                                    <TableCell className='text-end'>120</TableCell>
                                </TableRow>
                                <TableRow key="3">
                                    <TableCell>Noise Level (dB)</TableCell>
                                    <TableCell className='text-end'>61</TableCell>
                                </TableRow>
                                <TableRow key="4">
                                    <TableCell>Weight (lb.)</TableCell>
                                    <TableCell className='text-end'>25</TableCell>
                                </TableRow>
                            </TableBody>
            </Table>
            <Table isStriped hideHeader aria-label="Example static collection table" className='w-full'>
                            <TableHeader>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>ROLE</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow key="1" className='border-b-slate-800'>
                                    <TableCell>Features</TableCell>
                                    <TableCell className='text-end'>Battery Powered</TableCell>
                                </TableRow>
                                <TableRow key="2">
                                    <TableCell>Maximum Air Volume (CFM)</TableCell>
                                    <TableCell className='text-end'>473</TableCell>
                                </TableRow>
                                <TableRow key="3">
                                    <TableCell>Noise rating (dB)</TableCell>
                                    <TableCell className='text-end'>61</TableCell>
                                </TableRow>
                                <TableRow key="4">
                                    <TableCell>Email</TableCell>
                                    <TableCell className='text-end'>gisithj@gmail.com</TableCell>
                                </TableRow>
                            </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
