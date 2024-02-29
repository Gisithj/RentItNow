'use client'
import NavBar from '@/app/components/navbar'
import { passowrdError, validateEmail, validatePassword } from '@/utils/validation-helper';
import { Button, Input, Progress } from '@nextui-org/react'
import React, { useMemo, useState } from 'react'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';

function SignUp() {
  const [valueEmail, setValueEmail] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 
  const [progressValue, setValueProgressValue] = useState(25); 
  const [currentStep, setCurrentStep] = useState(1); 

  const isInvalidEmail = useMemo(() => {
    if (valueEmail === "") return false;
    return validateEmail(valueEmail) ? false : true;
  }, [valueEmail]);

  const isInvalidPassword = useMemo(() => {
    if (valuePassword === "") return false;
    console.log(valuePassword);
    return validatePassword(valuePassword) ? false : true;
  }, [valuePassword]);
  
  const handleStepChange = ()=>{
    if(currentStep!=4){
      setValueProgressValue((prev)=>prev+25)
      setCurrentStep((prev)=>prev+1)
    }
    
  }
  const handleStepBackward = ()=>{
    if(currentStep>1){
      setValueProgressValue((prev)=>prev-25)
      setCurrentStep((prev)=>prev-1)
    }
    
  }
  return (
      <div className='flex flex-col items-center gap-10 justify-center'>
        <div className='flex flex-col items-center gap-10 shadow-lg  w-fit md:w-2/3 lg:w-1/3 p-20 rounded-2xl'>
          <div>
            <h1 className='text-2xl font-bold'>Sign Up Now</h1>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Progress color="warning" aria-label="Loading..." value={progressValue} />
            <div className='flex gap-2 items-center justify-between'>
              <p className='font-medium text-sm'>Step {currentStep} of 4</p>
              
              <Button isDisabled={currentStep<2 }size="sm" className='flex flex-row gap-1 items-center' onClick={handleStepBackward}>
                <MdOutlineArrowBackIos  className='cursor-pointer'/>
                <p className='font-medium text-sm'>Go back</p>
              </Button>
              
            </div>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
          {currentStep==1?<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input type="text" variant={"bordered"} label="First name" />
              <Input type="text" variant={"bordered"} label="Last name" />
            </div>
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
            <Input type="text" variant={"bordered"} label="Mobile no" />
          </div>
          :currentStep==2?<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input type="text" variant={"bordered"} label="Address" />
              <Input type="text" variant={"bordered"} label="Last name" />
            </div>
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
            <Input type="text" variant={"bordered"} label="Mobile no" />
          </div>
          :currentStep==3?<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input type="text" variant={"bordered"} label="NIC" />
              <Input type="text" variant={"bordered"} label="Last name" />
            </div>
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
            <Input type="text" variant={"bordered"} label="Mobile no" />
          </div>
          :<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input type="text" variant={"bordered"} label="Picture" />
              <Input type="text" variant={"bordered"} label="Last name" />
            </div>
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
            <Input type="text" variant={"bordered"} label="Mobile no" />
          </div>
          }
          {
            currentStep==4?
              <Button color='primary' onClick={handleStepChange}>Sign up</Button>
            :
              <Button color='primary' onClick={handleStepChange}>Next</Button>
          }
          
          </form>
        </div>
      </div>
  )
}

export default SignUp