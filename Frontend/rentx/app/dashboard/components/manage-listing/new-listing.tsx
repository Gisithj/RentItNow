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
import { useRouter } from "next/navigation";
import { CREATE_ITEM } from "@/api/item";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { handleUpload } from "@/utils/imageUpload";
interface NewListingProps {
  handleNewListingClick: () => any;
}
function NewListing({ handleNewListingClick }: NewListingProps) {
  const [valueItemName, setValueItemName] = useState("");
  const [selectedRentOption, setSelectedRentOption] = useState("");
  const [typedRentValue, setTypedRentValue] = useState(0);
  const [rentalOptions, setRentalOptions] = useState<{ rentalOptionName: string; price: number }[]>([]);
  const [featureName, setFeatureName] = useState("");
  const [featureValue, setFeatureValue] = useState("");
  const [features, setFeatures] = useState<{ specificationFeature: string; featureDetail: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isCompleted, setIsCompleted] = useState(false);
  const [description, setDescription] = useState("");
  const [itemOverview, setItemOverview] = useState("");
  //const [valueHouseNo, setValuePassword] = useState("");
  // const dispatch = useAppDispatch()
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter()
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

  //handle add feature to the list
  const handleAddFeature = (value: any) => {
    if (featureName && featureValue) {
      setFeatures([...features, { specificationFeature: featureName, featureDetail: featureValue }]);
      setFeatureName("");
      setFeatureValue("");
    }
  };

  //handle remove feature from the list
  const handleRemoveFeature = (specificationFeature: string) => {
    const updatedfeatures = features.filter((pair) => pair.specificationFeature !== specificationFeature);
    setFeatures(updatedfeatures);
  };

  //handle add rent option to the list
  const handleAddRentalOption = () => {
    if (selectedRentOption && typedRentValue) {
      setRentalOptions([
        ...rentalOptions,
        { rentalOptionName: selectedRentOption, price: typedRentValue },
      ]);
      setSelectedRentOption("");
      setTypedRentValue(0);
    }
  };

  //handle remove rent option from the list
  const handleRemoveRentalOption = (keyToRemove: string) => {
    const updatedRentalOptions = rentalOptions.filter(
      (pair) => pair.rentalOptionName !== keyToRemove
    );
    setRentalOptions(updatedRentalOptions);
  };

  const selectedRentalOptions = rentalOptions.map((pair) => pair.rentalOptionName);


  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {    
    const files = Array.from(event.target.files || []);    
    setSelectedImages(files);

    // Preview images before uploading
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    console.log(imagePreviews);
    console.log(selectedImages);
  };

  // Remove image from the list
  const removeImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  let base64ImageArray: string[] = [];

  const handleUploadImages = async () => {

    //upload the images to AZURE
    const imageUrls = await handleUpload(selectedImages);
    
    const newItem = {
      itemName: valueItemName,
      itemDescription: description,
      rentalOptions: rentalOptions,
      specifications: features,
      images: imageUrls,
      isRented: false,
      itemOverview: itemOverview,
      renterId: user?.roleId!
    };
    console.log(newItem);
    console.log("base64ImageArray2",base64ImageArray);

    //call the create item API
    const responseData = CREATE_ITEM(newItem)
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
              placeholder="Enter breif description about the item (no more than two rows)"
              className="w-full"
              onValueChange={setDescription}
              maxRows={2}
              disableAutosize={true}
            />
            <Textarea
              label="Description"
              placeholder="Enter item overview"
              className="w-full"
              maxRows = {8}
              onValueChange={setItemOverview}
            />
            <div className="flex flex-col gap-4 border-small px-4 py-4 rounded-small border-default-200 dark:border-default-100">
              <h1 className="text-sm font-semibold">Rent options details</h1>
              <div className="flex flex-col gap-2">
                {rentalOptions.map((option, index) => (
                  <div className="flex flex-row gap-2 items-center" key={index}>
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rent option"
                      variant="bordered"
                      defaultValue="Rent per hour"
                      value={option.rentalOptionName}
                      className="max-w-xs"
                    />
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rental"
                      variant="bordered"
                      defaultValue="0"
                      value={option.price.toString()}
                      className="max-w-xs"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={() => handleRemoveRentalOption(option.rentalOptionName)}
                    >
                      <CiCircleMinus fontSize={25} />
                    </Button>
                  </div>
                ))}
              </div>
              {rentalOptions.length < 4 && (
                <div className="flex flex-row gap-2 items-center">
                  <Select
                    size="sm"
                    label="Select a rent option"
                    className="min-[400px]"
                    selectionMode="single"
                    defaultSelectedKeys=""
                    disabledKeys={selectedRentalOptions}
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
                    onPress={handleAddRentalOption}
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
                      value={feature.specificationFeature}
                      className="max-w-xs"
                    />
                    <Input
                      isReadOnly
                      size="sm"
                      type="text"
                      label="Rental"
                      variant="bordered"
                      defaultValue="0"
                      value={feature.featureDetail.toString()}
                      className="max-w-xs"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={() => handleRemoveFeature(feature.specificationFeature)}
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
              
            </div>
            <div>
                <Button
                  variant="solid"
                  size="md"
                  color="primary"
                  // isLoading
                  onPress={onOpen}
                  onClick={handleUploadImages}
                >Add Listing</Button>
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
                <Button color="primary" variant="solid" onPress={()=>{onClose();handleNewListingClick()}}>
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
