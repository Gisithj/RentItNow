import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Image,
  Skeleton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { VscEye } from "react-icons/vsc";
import ProductCarousel from "./listing-carousel/listing-images-carousel";
import { FaCircleCheck } from "react-icons/fa6";
interface NewListingProps {
  handleNewListingClick: () => any;
}
function NewListing({ handleNewListingClick }: NewListingProps) {
  const [valueItemName, setValueItemName] = useState("");
  const [selectedRentOption, setSelectedRentOption] = useState("");
  const [typedRentValue, setTypedRentValue] = useState(0);
  const [keyValuePairs, setKeyValuePairs] = useState<{ key: string; value: number }[]>([]);
  const [featureName, setFeatureName] = useState("");
  const [featureValue, setFeatureValue] = useState("");
  const [features, setFeatures] = useState<{ key: string; value: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isCompleted, setIsCompleted] = useState(false);
  //const [valueHouseNo, setValuePassword] = useState("");
  // const dispatch = useAppDispatch()
  // const router = useRouter()
  const rentOptions = [
    {
      label: "Rent per hour",
      value: "Rent per hour",
    },
    {
      label: "Rent per day",
      value: "Rent per day",
    },
    {
      label: "Rent per week",
      value: "Rent per week",
    },
    {
      label: "Rent per month",
      value: "Rent per month",
    },
  ];
  const handleAddFeature = (value: any) => {
    if (featureName && featureValue) {
      setFeatures([...features, { key: featureName, value: featureValue }]);
      setFeatureName("");
      setFeatureValue("");
    }
  };

  const handleRemoveFeature = (keyToRemove: string) => {
    const updatedfeatures = features.filter((pair) => pair.key !== keyToRemove);
    setFeatures(updatedfeatures);
  };

  const handleAddKeyValuePair = () => {
    console.log(selectedRentOption);

    if (selectedRentOption && typedRentValue) {
      setKeyValuePairs([
        ...keyValuePairs,
        { key: selectedRentOption, value: typedRentValue },
      ]);
      setSelectedRentOption("");
      setTypedRentValue(0);
    }
    console.log(keyValuePairs);
  };

  const handleRemoveKeyValuePair = (keyToRemove: string) => {
    const updatedKeyValuePairs = keyValuePairs.filter(
      (pair) => pair.key !== keyToRemove
    );
    setKeyValuePairs(updatedKeyValuePairs);
  };

  const selectedKeys = keyValuePairs.map((pair) => pair.key);


  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    
    const files = Array.from(event.target.files || []);
    
    setSelectedImages(files);

    // Preview images before uploading
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    console.log(imagePreviews);
    console.log(selectedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleUpload = () => {
    // Convert selected images to base64
    // console.log(imagePreviews);
    // console.log(selectedImages);

   
    const base64Images = selectedImages.map(file => ({
      name: file.name,
      base64: URL.createObjectURL(file)
    }));

    // Send base64Images to backend
    // Example: Send base64Images array to backend using fetch or Axios
  };
  useEffect(()=>{ 
    console.log(imagePreviews);
    console.log(selectedImages);
  },[imagePreviews,selectedImages])

  const handleSubmit = async () => {
    console.log("in the handle submit");

    try {
      //   const newCustomer = {
      //     "name": valueItemName+valueLastName ,
      //     "email": valueEmail,
      //     "contactNo": valueMobileNo,
      //     "address":valueAddress ,
      //     "userName":valueItemName+valueLastName ,
      //     "password": valuePassword
      //   }
      //   console.log(newCustomer);
      //   const responseData = await REGISTER_CUSTOMER(newCustomer)
      //   if( responseData?.status===200){
      //     // dispatch(login())
      //     // router.push("/")
      //   }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <Button
          // isIconOnly
          startContent={<IoMdArrowBack size={20} />}
          className="data-[hover]:bg-foreground/10"
          radius="sm"
          size="sm"
          variant="ghost"
          onPress={handleNewListingClick}
        >
          Go back
        </Button>
        <h1 className="text-2xl font-bold">Add a new listing</h1>
      </div>
      <div className="w-full flex flex-col gap-4">
        <form action="" className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-4 w-1/2">
            <Input
              type="text"
              variant={"bordered"}
              label="Item name"
              value={valueItemName}
              onValueChange={setValueItemName}
              isRequired
            />
            <Textarea
              label="Description"
              placeholder="Enter your description"
              className="w-full"
            />
            <div className="flex flex-col gap-4 border-small px-4 py-4 rounded-small border-default-200 dark:border-default-100">
              <h1 className="text-sm font-semibold">Rent options details</h1>
              <div className="flex flex-col gap-2">
                {keyValuePairs.map((option, index) => (
                  <div className="flex flex-row gap-2 items-center" key={index}>
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rent option"
                      variant="bordered"
                      defaultValue="Rent per hour"
                      value={option.key}
                      className="max-w-xs"
                    />
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rental"
                      variant="bordered"
                      defaultValue="0"
                      value={option.value.toString()}
                      className="max-w-xs"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={() => handleRemoveKeyValuePair(option.key)}
                    >
                      <CiCircleMinus fontSize={25} />
                    </Button>
                  </div>
                ))}
              </div>
              {keyValuePairs.length < 4 && (
                <div className="flex flex-row gap-2 items-center">
                  <Select
                    size="sm"
                    label="Select a rent option"
                    className="min-[400px]"
                    selectionMode="single"
                    defaultSelectedKeys=""
                    disabledKeys={selectedKeys}
                    onChange={(event) =>
                      setSelectedRentOption(event.target.value)
                    }
                  >
                    {rentOptions.map((rentOption) => (
                      <SelectItem
                        key={rentOption.value}
                        value={rentOption.value}
                      >
                        {rentOption.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="text"
                    variant={"bordered"}
                    label="Rental"
                    size="sm"
                    value={typedRentValue.toString()}
                    onChange={(event) =>
                      setTypedRentValue(parseInt(event.target.value))
                    }
                    isRequired
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="full"
                    onPress={handleAddKeyValuePair}
                  >
                    <CiCirclePlus fontSize={25} />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 border-small px-4 py-4 rounded-small border-default-200 dark:border-default-100">
              <h1 className="text-sm font-semibold">Item specifications</h1>
              <div className="flex flex-col gap-2">
                {features.map((feature, index) => (
                  <div className="flex flex-row gap-2 items-center" key={index}>
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rent option"
                      variant="bordered"
                      defaultValue="Rent per hour"
                      value={feature.key}
                      className="max-w-xs"
                    />
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rental"
                      variant="bordered"
                      defaultValue="0"
                      value={feature.value.toString()}
                      className="max-w-xs"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={() => handleRemoveFeature(feature.key)}
                    >
                      <CiCircleMinus fontSize={25} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Input
                  type="text"
                  variant={"bordered"}
                  label="Feature detail"
                  size="sm"
                  value={featureName}
                  onValueChange={setFeatureName}
                  isRequired
                />
                <Input
                  type="text"
                  variant={"bordered"}
                  label="Feature detail"
                  size="sm"
                  value={featureValue}
                  onValueChange={setFeatureValue}
                  isRequired
                />
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  onPress={handleAddFeature}
                >
                  <CiCirclePlus fontSize={25} />
                </Button>
              </div>
              <div>
                <Button
                  variant="solid"
                  size="md"
                  color="primary"
                  // isLoading
                  onPress={onOpen}
                >Add Listing</Button>
              </div>
            </div>
          </div>
          <div className="w-1/2">
          <ProductCarousel imageList={imagePreviews} handleFileChange={handleFileChange} removeImage={removeImage}/>
  
     
           
          </div>
        </form>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"/>
              <ModalBody className="flex flex-col items-center text-center">
                <FaCircleCheck fontSize={30} className="text-success"/>
                <h1 className="text-xl font-medium">Your item is listed successfully!!</h1>
               
              </ModalBody>
              <ModalFooter className="flex flex-col items-center text-center">
                <Button color="primary" variant="solid" onPress={onClose}>
                  Return to listings
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </div>
    </div>
  );
}

export default NewListing;
