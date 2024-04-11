'use client'
import { LOGIN } from '@/api/auth';
import { login } from '@/lib/features/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { startConnection } from '@/utils/signalrService';
import { passowrdError,validatePassword } from '@/utils/validation-helper';
import { Input } from '@nextui-org/input'
import { Button, Card, CardBody, Link, Tab, Tabs } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

function SignIn() {

  const [selectedTab, setSelectedTab] = useState(""); 
  const [valueUsername, setValueUsername] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  const router = useRouter();


  const isInvalidPassword = useMemo(() => {
    if (valuePassword === "") return false;
    return validatePassword(valuePassword) ? false : true;
  }, [valuePassword]);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async()=>{
      try {
        const loginCredentials = {        
          "username":valueUsername ,
          "password": valuePassword
        }
        
        const responseData = await LOGIN(loginCredentials)       
        if( responseData?.status===200){ 
          localStorage.setItem('token',responseData.data.token)
          console.log("in heeeeeeeeeee");
          
          dispatch(login())  
            if(selectedTab === "renter"){
              console.log("in the renter route");
              startConnection();
              router.push("/dashboard/home") 
            }else{
              router.push("/") 
            }      
        }   
      } catch (error) {
        console.log(error);
      }
    }
    console.log(user);
    
    useEffect(()=>{
      if(isLoggedIn && user){
        if(user.userRoles.includes("Renter")){
          startConnection();
          router.push("/dashboard/home") 
        }else{
          startConnection();
          router.push("/") 
        }
      }else{
        router.push("/auth/sign-in") 
      }
    },[isLoggedIn, router, user])
    
  const handleTabs = (value:any)=>{
    setSelectedTab(value)
    
  }
  return (
      <div className='flex flex-col items-center gap-10 justify-center'>
        <div className='flex flex-col items-center gap-10 shadow-lg w-fit md:w-2/3 lg:w-1/3 p-20 rounded-2xl'>
          <div>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
          <Tabs aria-label="Options" onSelectionChange={(e)=>handleTabs(e)}>
            <Tab key="customer" title="Customer">
              <Card className='w-full'>
                <CardBody className='w-full'>
                  <Input
                    type="text"
                    variant={"bordered"}
                    label="Username"
                    // isInvalid={isInvalidEmail}
                    // color={isInvalidEmail ? "danger" : "default"}
                    // errorMessage={isInvalidEmail && "Please enter a valid Username"}
                    onValueChange={setValueUsername}/>
                  <Input
                    type={isVisible ? "text" : "password"}
                    variant={"bordered"}
                    label="Password"
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <VscEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <VscEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    isInvalid={isInvalidPassword}
                    color={isInvalidPassword ? "danger" : "default"}
                    errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`}
                    onValueChange={setValuePassword}
                    />
                
                  <Button color='primary' onClick={handleSubmit}>Log in</Button>
                  <Button as={Link} color="primary" href="/auth/sign-up" variant="flat">
                        Sign Up
                  </Button>
                </CardBody>
              </Card>  
            </Tab>
            <Tab key="renter" title="Renter">
              <Card>
                <CardBody>
                <Input
              type="text"
              variant={"bordered"}
              label="Username"
              // isInvalid={isInvalidEmail}
              // color={isInvalidEmail ? "danger" : "default"}
              // errorMessage={isInvalidEmail && "Please enter a valid Username"}
              onValueChange={setValueUsername}/>
            <Input
              type={isVisible ? "text" : "password"}
              variant={"bordered"}
              label="Password"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <VscEye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <VscEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              isInvalid={isInvalidPassword}
              color={isInvalidPassword ? "danger" : "default"}
              errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`}
              onValueChange={setValuePassword}
              />
          
            <Button color='primary' onClick={handleSubmit}>Log in</Button>
            <Button as={Link} color="primary" href="/auth/sign-up" variant="flat">
                  Sign Up
            </Button>
                </CardBody>
              </Card>  
            </Tab>           
          </Tabs>
           
          </form>
        </div>
      </div>
  )
}

export default SignIn