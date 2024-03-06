'use client'
import { LOGIN } from '@/api/auth';
import { login } from '@/lib/features/authSlice';
import { passowrdError,validatePassword } from '@/utils/validation-helper';
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

function SignIn() {
  const [valueUsername, setValueUsername] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 

  const dispatch = useDispatch();
  const router = useRouter();


  const isInvalidPassword = useMemo(() => {
    if (valuePassword === "") return false;
    console.log(valuePassword);
    return validatePassword(valuePassword) ? false : true;
  }, [valuePassword]);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async()=>{
    console.log("in the handle submit");
    
      try {
        const loginCredentials = {        
          "username":valueUsername ,
          "password": valuePassword
        }
        console.log(loginCredentials);
        
        const responseData = await LOGIN(loginCredentials)       
        if( responseData?.status===200){ 
          localStorage.setItem('token',responseData.data.token)
          console.log("in heeeeeeeeeee");
          
          dispatch(login())  
          router.push("/") 
        }       
           
        
      } catch (error) {
        console.log(error);
        
      }
    }

  return (
      <div className='flex flex-col items-center gap-10 justify-center'>
        <div className='flex flex-col items-center gap-10 shadow-lg w-fit md:w-2/3 lg:w-1/3 p-20 rounded-2xl'>
          <div>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
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
          </form>
        </div>
      </div>
  )
}

export default SignIn