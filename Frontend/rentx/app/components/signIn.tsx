'use client'
import { GOOGLE_LOGIN, LOGIN } from '@/api/auth';
import { login } from '@/lib/features/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { startConnection } from '@/utils/signalrService';
import { passowrdError,validatePassword } from '@/utils/validation-helper';
import { Input } from '@nextui-org/input'
import { Button, Card, CardBody, Link, Spinner, Tab, Tabs } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { FcGoogle } from "react-icons/fc";

function SignIn({onClose}:{onClose:()=>void}) {

  const [selectedTab, setSelectedTab] = useState(""); 
  const [valueUsername, setValueUsername] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 
  const [isCredentialsWrong,setIsCredentialsWrong] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoginStarted,setIsLoginStarted] = useState(false);
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
        setIsLoginStarted(true);
        const responseData = await LOGIN(loginCredentials)       
        if( responseData?.status===200){ 
          localStorage.setItem('token',responseData.data.token)
          console.log("in heeeeeeeeeee");
          
          dispatch(login()).then(()=>{
            onClose();
          })
            // if(selectedTab === "renter"){
            //   console.log("in the renter route");
            //   startConnection();
            //   router.push("/dashboard/home") 
            // }else{
            //   router.push("/") 
            // }      
        }else if(responseData?.status===401){
          console.log("in the 401");          
          setIsCredentialsWrong(true)
        } 
      } catch (error) {
        console.log(error);
      }
    }
    // const handleGoogleLogin = async () => {
    //   try {
    //     const response = await GOOGLE_LOGIN();
    //     if(response?.status===200){ 
    //       localStorage.setItem('token',response.data.token)
    //       dispatch(login()).then(()=>{
    //         onClose();
    //       })
    //     }else if(response?.status===401){
    //       setIsCredentialsWrong(true)
    //     } 
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // useEffect(()=>{
    //   if(isLoggedIn && user){
    //     if(user.userRoles.includes("Renter")){
    //       startConnection();
    //       router.push("/dashboard/home") 
    //     }else{
    //       startConnection();
    //       router.push("/") 
    //     }
    //   }else{
    //     router.push("/auth/sign-in") 
    //   }
    // },[isLoggedIn, router, user])
    
  const handleTabs = (value:any)=>{
    setSelectedTab(value)
    
  }
  return (
      <div className='flex bg-inherit flex-col items-center gap-10 justify-center'>
        <div className='flex flex-col items-center gap-10 w-fit px-4 py-10 rounded-2xl h-full'>
          <div>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
          <Tabs aria-label="Options" onSelectionChange={(e)=>handleTabs(e)} className='flex justify-center'>
            <Tab key="customer" title="Customer" className='flex flex-col gap-4 items-center'>
                  <Input
                    id='username'
                    type="text"
                    variant={"bordered"}
                    label="Username"
                    onValueChange={setValueUsername}/>
                  <Input
                    id='password'
                    type={isVisible ? "text" : "password"}
                    variant={"bordered"}
                    label="Password"
                    isInvalid={isInvalidPassword}
                    color={isInvalidPassword ? "danger" : "default"}
                    errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`||
                    isCredentialsWrong && "Incorrect username or password"}
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
              onValueChange={setValueUsername}/>
            <Input
              type={isVisible ? "text" : "password"}
              variant={"bordered"}
              label="Password"
              isInvalid={isInvalidPassword}
              color={isInvalidPassword ? "danger" : "default"}
              errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`||
              isCredentialsWrong && "Incorrect username or password"}
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