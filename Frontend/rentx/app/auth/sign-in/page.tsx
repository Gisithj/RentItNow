'use client'
import NavBar from '@/app/components/navbar'
import { passowrdError, validateEmail,validatePassword } from '@/utils/validation-helper';
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/react';
import React, { useMemo, useState } from 'react'

function SignIn() {
  const [valueEmail, setValueEmail] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 

  const isInvalidEmail = useMemo(() => {
    if (valueEmail === "") return false;
    return validateEmail(valueEmail) ? false : true;
  }, [valueEmail]);

  const isInvalidPassword = useMemo(() => {
    if (valuePassword === "") return false;
    console.log(valuePassword);
    return validatePassword(valuePassword) ? false : true;
  }, [valuePassword]);

  return (
      <div className='flex flex-col items-center gap-10 justify-center'>
        <div className='flex flex-1 flex-col items-center gap-10 shadow-lg w-fit md:w-2/3 lg:w-1/3 p-20 rounded-2xl'>
          <div>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
          <Input
            type="email"
            variant={"bordered"}
            label="Email"
            isInvalid={isInvalidEmail}
            color={isInvalidEmail ? "danger" : "default"}
            errorMessage={isInvalidEmail && "Please enter a valid email"}
            onValueChange={setValueEmail}/>
          <Input
            type="password"
            variant={"bordered"}
            label="Password"
            isInvalid={isInvalidPassword}
            color={isInvalidPassword ? "danger" : "default"}
            errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`}
            onValueChange={setValuePassword}/>
        
          <Button color='primary'>Log in</Button>
          </form>
        </div>
      </div>
  )
}

export default SignIn