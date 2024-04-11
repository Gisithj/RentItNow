'use client'
import { REGISTER_CUSTOMER } from '@/api/auth';
import NavBar from '@/app/components/navbar'
import { login } from '@/lib/features/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { startConnection } from '@/utils/signalrService';
import { passowrdError, validateEmail, validatePassword } from '@/utils/validation-helper';
import { Button, Input, Progress } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
function SignUp() {
  const [progressValue, setValueProgressValue] = useState(50); 
  const [currentStep, setCurrentStep] = useState(1); 
  const totalSteps = 2;
  const [valueEmail, setValueEmail] = useState("example@gmail.com"); 
  const [valuePassword, setValuePassword] = useState(""); 
  const [valueFirstName, setValueFirstName] = useState(""); 
  const [valueLastName, setValueLastName] = useState(""); 
  const [valueMobileNo, setValueMobileNo] = useState(""); 
  const [valueHouseNo, setValueHouseNo] = useState(""); 
  const [valuePostalCode, setValuePostalCode] = useState(""); 
  const [valueAddress, setValueAddress] = useState(""); 
  const [valueNIC, setValueNIC] = useState(""); 
  //const [valueHouseNo, setValuePassword] = useState(""); 
  const dispatch = useAppDispatch()
  const router = useRouter()

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
    if(currentStep!=totalSteps){
      if(!isInvalidEmail && !isInvalidPassword && (valueEmail!="") && (valuePassword!="")){
        setValueProgressValue((prev)=>prev+50)
        setCurrentStep((prev)=>prev+1)
      }
     
    }else{
      if(currentStep==totalSteps){
        console.log("submitted");
        
        handleSubmit()
      }
    }
    
  }
  const handleStepBackward = ()=>{
    if(currentStep>1){
      setValueProgressValue((prev)=>prev-25)
      setCurrentStep((prev)=>prev-1)
    }
  }
  
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);  

  const handleSubmit = async()=>{
    console.log("in the handle submit");
    
    if(currentStep==totalSteps){
      try {
        const newCustomer = {
          "name": valueFirstName+valueLastName ,
          "email": valueEmail,
          "contactNo": valueMobileNo,
          "address":valueAddress ,
          "userName":valueFirstName+valueLastName ,
          "password": valuePassword
        }
        console.log(newCustomer);
        
        const responseData = await REGISTER_CUSTOMER(newCustomer)
        if( responseData?.status===200){ 
          dispatch(login())  
          startConnection();
          router.push("/") 
        } 
        
      } catch (error) {
        console.log(error);
        
      }
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
              <p className='font-medium text-sm'>Step {currentStep} of {totalSteps}</p>
              
              <Button isDisabled={currentStep<2 }size="sm" className='flex flex-row gap-1 items-center' onClick={handleStepBackward}>
                <MdOutlineArrowBackIos  className='cursor-pointer'/>
                <p className='font-medium text-sm'>Go back</p>
              </Button>
              
            </div>
          </div>
          <form action="" className='flex flex-col gap-4 w-full'>
          {currentStep==1?<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input 
                type="text" 
                variant={"bordered"} 
                label="First name" 
                value={valueFirstName}
                onValueChange={setValueFirstName} 
                isRequired/>
              <Input 
                type="text" 
                variant={"bordered"} 
                label="Last name" 
                value={valueLastName}
                onValueChange={setValueLastName} 
                isRequired/>
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
              onValueChange={setValuePassword}/>
            <Input type="text" variant={"bordered"} label="Mobile no" onValueChange={setValueMobileNo}/>
          </div>
          // :currentStep==2?<div className="flex flex-col gap-4 w-full">
           :<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input type="text" variant={"bordered"} label="House no" onValueChange={setValueHouseNo}/> 
              <Input type="text" variant={"bordered"} label="Postal code" onValueChange={setValuePostalCode} isRequired/>
            </div>
            <Input
              type="text"
              variant={"bordered"}
              label="Address"
              value={valueAddress}           
              onValueChange={setValueAddress}
              isRequired
              />
            <Input
              type="text"
              variant={"bordered"}
              label="NIC"   
              value={valueNIC}          
              onValueChange={setValueNIC}
              isRequired
              />
            <Input type="text" variant={"bordered"} label="Mobile no" />
          </div>
          // :currentStep==3?<div className="flex flex-col gap-4 w-full">
          //   <div className="flex gap-4">
          //     <Input type="text" variant={"bordered"} label="NIC" />
          //     <Input type="text" variant={"bordered"} label="Last name" />
          //   </div>
          //   <Input
          //     type="email"
          //     variant={"bordered"}
          //     label="Email"
          //     isInvalid={isInvalidEmail}
          //     color={isInvalidEmail ? "danger" : "default"}
          //     errorMessage={isInvalidEmail && "Please enter a valid email"}
          //     onValueChange={setValueEmail}/>
          //   <Input
          //     type="password"
          //     variant={"bordered"}
          //     label="Password"
          //     isInvalid={isInvalidPassword}
          //     color={isInvalidPassword ? "danger" : "default"}
          //     errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`}
          //     onValueChange={setValuePassword}/>
          //   <Input type="text" variant={"bordered"} label="Mobile no" />
          // </div>
          // :<div className="flex flex-col gap-4 w-full">
          //   <div className="flex gap-4">
          //     <Input type="text" variant={"bordered"} label="Picture" />
          //     <Input type="text" variant={"bordered"} label="Last name" />
          //   </div>
          //   <Input
          //     type="email"
          //     variant={"bordered"}
          //     label="Email"
          //     isInvalid={isInvalidEmail}
          //     color={isInvalidEmail ? "danger" : "default"}
          //     errorMessage={isInvalidEmail && "Please enter a valid email"}
          //     onValueChange={setValueEmail}/>
          //   <Input
          //     type="password"
          //     variant={"bordered"}
          //     label="Password"
          //     isInvalid={isInvalidPassword}
          //     color={isInvalidPassword ? "danger" : "default"}
          //     errorMessage={isInvalidPassword && ` Password must contain ${passowrdError(valuePassword)}.`}
          //     onValueChange={setValuePassword}/>
          //   <Input type="text" variant={"bordered"} label="Mobile no" />
          // </div>
          }
          {
            currentStep==totalSteps?
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