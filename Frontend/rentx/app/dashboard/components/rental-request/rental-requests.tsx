import { Button, Chip, ChipProps, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, SortDescriptor, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Tooltip, useDisclosure, user } from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import RentalReqest from './rental-request-card';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { connection } from '@/utils/signalrService';
import { END_RENT_ITEM } from '@/api/item';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchRentedItemsByRoleId } from '@/lib/features/updateTriggerSlice';
import { useAppDispatch } from '@/lib/hooks';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdDeleteOutline, MdOutlineEventAvailable } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import {Key} from "@react-types/shared";
import { CustomerRentalItem, RentalItem } from '@/utils/interfaces';
import { BsThreeDots } from 'react-icons/bs';
import { EyeIcon, EditIcon, DeleteIcon } from 'lucide-react';
import { FiDelete } from 'react-icons/fi';
import { AxiosError } from 'axios';

const statusColorMap: Record<string, ChipProps["color"]> = {
  Rented: "success",
  Overdue: "danger",
  Reserved: "warning",
  Available: "primary",
  Active: "success",
  Returned: "primary",
};

const statusOptions = [
  { name: "All", uid: "all" },
  { name: "Active", uid: "Rented" },
  { name: "Reserved", uid: "Reserved" },
  { name: "Returned", uid: "Available" },
  { name: "Overdue", uid: "Overdue" },
];


const columns = [
  // { name: "ID", uid: "id", sortable: true },
  { name: "ITEM NAME", uid: "item" },
  { name: "START DATE", uid: "rentalStartDate", sortable: true },
  { name: "END DATE", uid: "rentalEndDate", sortable: true },
  { name: "RENTAL OPTION", uid: "rentalOptionId", sortable: true },
  { name: "RENTAL PRICE", uid: "rentalPrice", sortable: true },
  { name: "RENTALSTATUS", uid: "rentalStatus", sortable: true },
  { name: "ACTIONS", uid: "actions", sortable: true },
];
function RentalRequests() {

  const dispatch = useAppDispatch();  
  const router = useRouter();
  const {isOpen, onOpen, onClose,onOpenChange} = useDisclosure();

  const {user,isLoggedIn} = useSelector((state: RootState) => state.auth);
  const { rentalRequestList} = useSelector((state:RootState) => state.updateTrigger)

  const [isEndRentalConfirmed,setIsEndRentalConfirmed] = useState(false)
  const [isRentalEnded,setIsRentalEnded] = useState(false)
  const [rentalRequest,setRentalRequest] = useState({itemId: '', rentalId: ''})
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Key>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/rent-tools");
    }
  }, [isLoggedIn]);


  const filteredItems = useMemo(() => {
    let filteredUsers = rentalRequestList ? [...rentalRequestList] : [];

    if (statusFilter !== "all") {
        const filterKeys = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
        
        filteredUsers = filteredUsers.filter((item) =>
          filterKeys.includes(item.rentalStatus)
        );
      }
    return filteredUsers;
  }, [rentalRequestList, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items!].sort((a: CustomerRentalItem, b: CustomerRentalItem) => {
      const first = a[sortDescriptor.column as keyof CustomerRentalItem];
      const second = b[sortDescriptor.column as keyof CustomerRentalItem];

      let cmp;


      if (
        sortDescriptor.column === "rentalStartDate" ||
        sortDescriptor.column === "rentalEndDate"
      ) {
        const firstDate = new Date(first as string);
        const secondDate = new Date(second as string);
        cmp = firstDate < secondDate ? -1 : firstDate > secondDate ? 1 : 0;
      } else {
        
        cmp =
          (first as number) < (second as number)
            ? -1
            : (first as number) > (second as number)
            ? 1
            : 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (rentalItem: RentalItem, columnKey: React.Key) => {
      switch (columnKey) {
        case "item":
          return (
            <p className="text-bold text-small capitalize">
              {rentalItem.item.itemName}
            </p>
          );
        case "rentalStartDate":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-500">
                {new Date(rentalItem.rentalStartDate).toDateString()}
              </p>
            </div>
          );
        case "rentalEndDate":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm text-default-500 capitalize">
                {new Date(rentalItem.rentalEndDate).toDateString()}
              </p>
            </div>
          );
        case "rentalOptionId":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-500">
                {rentalItem.item.rentalOptions
                  .find((option) => option.id === rentalItem.rentalOptionId)
                  ?.rentalOptionName.toLowerCase()}
              </p>
            </div>
          );
        case "rentalPrice":
          return (
            <div className="flex flex-row justify-between w-full gap-2 items-center">
              {/* <p className="text-bold text-small capitalize">{cellValue}</p> */}
              <p className="font-medium text-tiny capitalize text-default-500">
                Rs. 
              </p>
              <p className="font-medium text-sm capitalize text-default-500">
              {rentalItem.rentalPrice.toFixed(2)} 
              </p>
            </div>
          );
        case "rentalStatus":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[rentalItem.rentalStatus]}
              size="sm"
              variant="flat"
            >
              {rentalItem.rentalStatus === "Available"
                ? "Returned"
                : rentalItem.rentalStatus}
            </Chip>
          );
          case "actions":
            return (
                <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={()=>handleRowClick(rentalItem.rentalId)}>
                <EyeIcon/>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="End rental">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={()=>handleEndRentalModelOpen(rentalItem.itemID,rentalItem.rentalId)}>
                <MdDeleteOutline size={20} />
              </span>
            </Tooltip>
          </div>
            );
        default:
          return null;
      }
    },
    []
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const handleEndRentalModelOpen = (itemId:string,rentalId:string)=>{
    setIsRentalEnded(false);
    setIsEndRentalConfirmed(false)    
    setRentalRequest({itemId: itemId, rentalId: rentalId})    
    onOpen()
    
  }
  

  const handleRowClick = (key: string) => {
    router.push(`/product/${key}/${true}`);
  };
  const handleEndRentalClick = ()=>{
   if(user){
    setIsEndRentalConfirmed(true)    
    END_RENT_ITEM(rentalRequest.itemId,rentalRequest.rentalId).then((response) => {
      console.log(response);
      dispatch(fetchRentedItemsByRoleId(user.roleId));
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setIsRentalEnded(true);
    });
   }else{
      console.log("user not found");    
   }
  }
  useEffect(() => {
    if(user){
      dispatch(fetchRentedItemsByRoleId(user.roleId));      
    }
  }, [user]);


type StatusCounts = Record<string, number>;

const statusCounts = statusOptions.reduce((acc: StatusCounts, status) => {
if (status.uid === "all") {
    acc[status.uid] = rentalRequestList ? rentalRequestList.length : 0;
} else {
    acc[status.uid] = rentalRequestList ? rentalRequestList.filter(item => item.rentalStatus === status.uid).length : 0;
}
return acc;
}, {} as StatusCounts); 

const bottomContent = useMemo(() => {
  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  );
}, [rentalRequestList, page, pages]);

  return (
    <div className='w-full flex flex-col gap-4'>
      
    <div className='flex flex-row justify-between'>
      <h1 className='text-2xl font-bold'>Rentals</h1>
    </div>
       <div className="flex w-full flex-col items-center justify-center align-middle">
      <Tabs
        aria-label="Options"
        selectedKey={statusFilter}
        className="text-center flex items-center"
        onSelectionChange={setStatusFilter}
        color={statusColorMap[statusFilter]}
        variant="underlined"
      >
        {statusOptions.map((status) => (
                      <Tab
                      
                      key={status.uid}
                      title={
                        <div className="flex items-center space-x-2">
                          <MdOutlineEventAvailable size={20} />
                          <span>{status.name}</span>
                          <Chip 
                          className="capitalize"
                          variant="flat"
                          color={statusColorMap[status.name]}
                          >
                            {statusCounts[status.uid]}
                          </Chip>
                        </div>
                      }
                    >
                      <Table
                        aria-label="Table with rental items "
                        isHeaderSticky
                        bottomContent={statusCounts[status.uid]>rowsPerPage? bottomContent:null}
                        bottomContentPlacement="outside"
                        classNames={{
                          wrapper: "max-h-[90vh] min-h-[40vh] w-full",
                        }}
                        selectionMode="single"
                        sortDescriptor={sortDescriptor}
                        topContentPlacement="outside"
                        onSortChange={setSortDescriptor}
                      >
                        <TableHeader columns={columns}>
                          {(column) => (
                            <TableColumn
                              key={column.uid}
                              align={column.uid === "rentalEndDate" ? "center" : "start"}
                              allowsSorting={column.sortable}
                            >
                              {column.name}
                            </TableColumn>
                          )}
                        </TableHeader>
                        <TableBody
                          emptyContent={"No rentals found"}
                          items={sortedItems}
                          className="min-h-[50vh]"
                        >
                          {(item) => (
                            <TableRow key={item.rentalId}>
                              {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Tab>
                ))}
    
        </Tabs>
    </div>
  <Modal 
    isOpen={isOpen} 
    onOpenChange={onOpenChange} 
    isDismissable={true} 
    backdrop="opaque"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
  >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"/>
              <ModalBody className="flex flex-col items-center text-center">
                {!isEndRentalConfirmed?
                <>
                <h1 className="text-xl font-medium">
                  Are you sure you want to end the rental of this item?
                </h1>
              
                </>
                :
                !isRentalEnded?
                <CircularProgress color="default" aria-label={'Deleting the item...'}/>
                :
                <>
                <FaCircleCheck fontSize={30} className="text-success"/>
                
                <h1 className="text-xl font-medium">
                  {!isRentalEnded?'Deleting the item...':'Your item is Rental Ended successfully!!'}
                </h1>
                </>
               }
              </ModalBody>
              <ModalFooter className="flex flex-col items-center text-center">
                {!isEndRentalConfirmed && !isRentalEnded?
                <div className='flex gap-2'>
                  <Button color="danger" variant="bordered" onPress={onClose}>
                  No
                </Button>
                <Button color="danger" variant="solid" onPress={()=>handleEndRentalClick()}>
                  Confirm EndRental
                </Button>
                </div>
                :
                <Button color="primary" variant="solid" onPress={onClose}>
                  Return to listings
                </Button>
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  </div>
  )
}

export default RentalRequests