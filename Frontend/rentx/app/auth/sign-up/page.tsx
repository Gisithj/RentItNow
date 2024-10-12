'use client'
import { REGISTER_CUSTOMER, REGISTER_RENTER } from '@/api/auth';
import NavBar from '@/app/components/navbar'
import { login } from '@/lib/features/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { startConnection } from '@/utils/signalrService';
import { passowrdError, validateEmail, validatePassword } from '@/utils/validation-helper';
import { Button, Input, Link, Progress, Spinner } from '@nextui-org/react'
import { set } from 'lodash';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
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
  const [pictureUrl, setPictureUrl] = useState("https://rentx.blob.core.windows.net/rentximages/user_icon.png"); 
  const [isLoginStarted,setIsLoginStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams();

  const userType = searchParams.get('userType');

  const isInvalidEmail = useMemo(() => {
    if (valueEmail === "") return false;
    return validateEmail(valueEmail) ? false : true;
  }, [valueEmail]);

  const isInvalidPassword = useMemo(() => {
    if (valuePassword === "") return false;
    return validatePassword(valuePassword) ? false : true;
  }, [valuePassword]);
  
  const handleStepChange = ()=>{
    console.log("in the handle step change");
    console.log(currentStep);
    console.log(totalSteps);
    console.log(isInvalidEmail,isInvalidPassword);
    
    
    
    setIsSubmitted(true);
    if(currentStep!=totalSteps){
      if(!isInvalidEmail && !isInvalidPassword && (valueEmail!="") && (valuePassword!="") && (valueFirstName!="") && (valueMobileNo!="") ){
        setValueProgressValue((prev)=>prev+50)
        setCurrentStep((prev)=>prev+1)
      }
     
    }else{
      if(currentStep==totalSteps && (valuePostalCode!="") && (valueAddress!="") && (valueNIC!="") ){
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
    const handleSubmit = async()=>{
    console.log("in the handle submit");
    setIsLoginStarted(true);
    if(currentStep==totalSteps){
      try {
        console.log(userType);
        
        if(userType === "renter"){
          console.log("in the renter register");
          
        const newCustomer = {
          "name": valueFirstName+valueLastName ,
          "email": valueEmail,
          "contactNo": valueMobileNo,
          "address":valueAddress ,
          "userName":valueFirstName+valueLastName ,
          "password": valuePassword,
          "pictureUrl": pictureUrl,
        }
          const responseData = await REGISTER_RENTER(newCustomer)
          if( responseData?.status===200){ 
            dispatch(login())  
            router.push("/dashboard/home") 
          } 
        }else if(userType === "customer"){
          console.log("in the customer register");
          
        const newCustomer = {
          "name": valueFirstName+valueLastName ,
          "email": valueEmail,
          "contactNo": valueMobileNo,
          "address":valueAddress ,
          "userName":valueFirstName+valueLastName ,
          "password": valuePassword,
          "pictureUrl": pictureUrl,
        }
          const responseData = await REGISTER_CUSTOMER(newCustomer)
          if( responseData?.status===200){ 
            dispatch(login())  
            router.push("/rent-tools") 
          } 
        }
        
        
      } catch (error) {
        setIsLoginStarted(false);
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
          <form action="" className='flex flex-col gap-4 w-full items-center'>
          {currentStep==1?<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input 
                type="text" 
                variant={"bordered"} 
                label="First name" 
                value={valueFirstName}
                onValueChange={setValueFirstName} 
                validate={(value) => isSubmitted && value.length === 0 ? "First name is required" : true}
                isRequired/>
              <Input 
                type="text" 
                variant={"bordered"} 
                label="Last name" 
                value={valueLastName}
                onValueChange={setValueLastName} 
                />
            </div>
            <Input
              type="email"
              variant={"bordered"}
              label="Email"
              validate={(value) => isSubmitted ? isInvalidEmail || value.length === 0?"Email is required":true: isInvalidEmail?"Please enter a valid email":true}
              onValueChange={setValueEmail}
              isRequired
              />
            <Input
              type={"password"}
              variant={"bordered"}
              label="Password"
              validate={(value) => 
                isSubmitted ? 
                  isInvalidPassword || value.length === 0?"Password is required":true
                : 
                isInvalidPassword?"Please enter a valid email":true}
              onValueChange={setValuePassword}
              isRequired
              />
            <Input 
              type="text" 
              variant={"bordered"} 
              label="Mobile no" 
              onValueChange={setValueMobileNo}
              validate={(value) => isSubmitted && value.length === 0 ? "Mobile no is required" : true}
              isRequired
              />
          </div>
          // :currentStep==2?<div className="flex flex-col gap-4 w-full">
           :<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Input
                type="text"
                variant={"bordered"}
                label="NIC"   
                value={valueNIC}          
                onValueChange={setValueNIC}
                validate={(value) => isSubmitted && value.length === 0 ? "NIC no is required" : true}
                isRequired
                />
              <Input 
                  type="text"
                  variant={"bordered"} 
                  label="Postal code" 
                  onValueChange={setValuePostalCode} 
                  validate={(value) => isSubmitted && value.length === 0 ? "Postal code is required" : true}
                  isRequired/>
            </div>
            <Input
              type="text"
              variant={"bordered"}
              label="Address"
              value={valueAddress}           
              onValueChange={setValueAddress}
              validate={(value) => isSubmitted && value.length === 0 ? "Address is required" : true}
              isRequired
              />
           
            {/* <Input type="text" variant={"bordered"} label="Mobile no" /> */}
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
              <Button 
                color='primary' 
                onClick={handleStepChange} 
                className='w-full'
                endContent={isLoginStarted? <Spinner size={"sm"} color='white'/>:null}
                >Sign up</Button>
            :
              <Button color='primary' onClick={handleStepChange} className='w-full'>Next</Button>
          }
          <div className="h-5 border-b-2 border-gray-500 text-2xl text-center w-[90%] mb-4">
                    <span className="text-gray-500 text-sm px-2 bg-foreground-50">or</span>
                  </div>
                  <Button 
                      as={Link} 
                      color="primary" 
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/signin-google?usertype=${userType}`}
                      variant="bordered" 
                      startContent={<FcGoogle size={20}/>}
                      className='w-full'>
                  Sign up with Google
                </Button>
                <p className='text-xs'>Already have an account? <Link href="/auth/sign-in" className='text-xs'>Sign in</Link></p>
          </form>
        </div>
      </div>
  )
}

export default SignUp