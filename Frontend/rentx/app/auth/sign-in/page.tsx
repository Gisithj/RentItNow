'use client'
import { LOGIN } from '@/api/auth';
import { login } from '@/lib/features/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { connection, startConnection } from '@/utils/signalrService';
import { passowrdError,validatePassword } from '@/utils/validation-helper';
import { Input } from '@nextui-org/input'
import { Button, Card, CardBody, Divider, Link, Spinner, Tab, Tabs } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

function SignIn() {

  const [selectedTab, setSelectedTab] = useState(""); 
  const [valueUsername, setValueUsername] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 
  const [isCredentialsWrong,setIsCredentialsWrong] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams() 
  const redirectUri = searchParams.get('redirect') 
  const [isLoginStarted,setIsLoginStarted] = useState(false);

  // const isInvalidPassword = useMemo(() => {
  //   if (valuePassword === "") return false;
  //   return validatePassword(valuePassword) ? false : true;
  // }, [valuePassword]);


  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async()=>{
      try {
        if(!valueUsername || !valuePassword){
          setIsCredentialsWrong(true);
          return;
        };
        const loginCredentials = {        
          "username":valueUsername ,
          "password": valuePassword
        }
        
        setIsLoginStarted(true);  
        const responseData = await LOGIN(loginCredentials)     
        if( responseData?.status===200){ 
          localStorage.setItem('token',responseData.data.token)
          
          dispatch(login())  
            if(selectedTab === "renter"){
              router.push("/dashboard/home") 
            }else{
              router.push("/rent-tools") 
            }      
        }else if(responseData?.status===401){                 
          setIsCredentialsWrong(true)
          setIsLoginStarted(false);  
        } 
      } catch (error) {
        setIsLoginStarted(false);  
        console.log(error);
      }
    }
    
    useEffect(()=>{
      console.log("in the use effect sign in");
      console.log(isLoggedIn);
      console.log(user);

      if(isLoggedIn && user){        
        connection.state =="Disconnected"? startConnection():null;
        if(user.userRoles.includes("Renter")){
          if (redirectUri != null) {            
            router.push(redirectUri);
          } else {             
            router.push("/dashboard/home") 
          }
        }else{
          if (redirectUri != null) {
            router.push(redirectUri);
          } else {               
            router.push("/rent-tools") 
          }
        }
      }
    },[isLoggedIn, router, user])
    
  const handleTabs = (value:any)=>{
    setIsCredentialsWrong(false);
    setSelectedTab(value);    
  }
  return (
      <div className='flex flex-col items-center gap-10 justify-center'>
        <div className='flex flex-col items-center gap-10 shadow-lg w-fit md:w-2/3 lg:w-1/3 p-20 rounded-2xl h-full'>
          <div>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
          <Tabs aria-label="Options" onSelectionChange={(e)=>handleTabs(e)} className='flex justify-center w-full'>
            <Tab key="customer" title="Customer" className='flex flex-col gap-4 items-center w-full'>
                  <Input
                    id='username'
                    type="text"
                    variant={"bordered"}
                    label="Username"
                    isInvalid={isCredentialsWrong}
                    color={isCredentialsWrong ? "danger" : "default"}
                    onValueChange={setValueUsername}/>
                  <Input
                    id='password'
                    type={isVisible ? "text" : "password"}
                    variant={"bordered"}
                    label="Password"
                    isInvalid={isCredentialsWrong}
                    color={isCredentialsWrong ? "danger" : "default"}
                    errorMessage={isCredentialsWrong && "Incorrect username or password"}
                    onValueChange={setValuePassword}
                    />
                  <Button 
                    id="log_in" 
                    color='primary' 
                    onClick={handleSubmit} 
                    className='w-full'
                    endContent={isLoginStarted? <Spinner size={"sm"} color='white'/>:null}
                    >Sign in</Button>
                  <div className="h-5 border-b-1 border-gray-500 text-2xl text-center w-[90%] mb-4">
                    <span className="text-gray-500 text-sm px-2 bg-foreground-50">or</span>
                  </div>
                  <Button 
                      as={Link} 
                      color="primary" 
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/signin-google?usertype=customer`}
                      variant="bordered" 
                      startContent={<FcGoogle size={20}/>}
                      className='w-full'>
                  Sign in with Google
                </Button>
                <p className='text-xs'>Don&apos;t have a account yet? <Link href="/auth/sign-up?userType=customer" className='text-xs'>Sign up</Link></p>
                 
            </Tab>
            <Tab key="renter" title="Renter" className='flex flex-col gap-4 items-center'>
                <Input
              type="text"
              variant={"bordered"}
              label="Username"
              isInvalid={isCredentialsWrong}
              color={isCredentialsWrong ? "danger" : "default"}
              onValueChange={setValueUsername}/>
            <Input
              type={isVisible ? "text" : "password"}
              variant={"bordered"}
              label="Password"
              isInvalid={isCredentialsWrong}
              color={isCredentialsWrong ? "danger" : "default"}
              errorMessage={isCredentialsWrong && "Incorrect username or password"}
              onValueChange={setValuePassword}
              />
          
            <Button 
              color='primary' 
              onClick={handleSubmit} 
              className='w-full'
              endContent={isLoginStarted? <Spinner size={"sm"} color='white'/>:null}
              >Sign in</Button>
            <div className="h-5 border-b-1 border-gray-500 text-2xl text-center w-[90%] mb-4">
                    <span className="text-gray-500 text-sm px-2 bg-foreground-50">or</span>
                  </div>
            <Button 
            as={Link} 
            color="primary" 
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/signin-google?usertype=renter`}
            variant="bordered" 
            startContent={<FcGoogle size={20}/>}            
            className='w-full'  >
                  Sign in with Google
                </Button>
            
            <p className='text-xs'>Don&apos;t have a account yet? <Link href="/auth/sign-up?userType=renter" className='text-xs'>Sign up</Link></p>
            </Tab>           
          </Tabs>
           
          </form>
        </div>
      </div>
  )
}

export default SignIn