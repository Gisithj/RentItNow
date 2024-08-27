import { BsThreeDots } from "react-icons/bs";
import { ArrowDown, Link } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  ChipProps,
  Selection,
  SortDescriptor,
  Card,
  CardBody,
  Skeleton,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {Key} from "@react-types/shared";
import { useSelector } from "react-redux";
import { CustomerRentalItem, RentalItem } from "@/utils/interfaces";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import ItemCard from "@/app/components/home/featured/item-card";
import { MdOutlineEventAvailable, MdOutlineEventBusy } from "react-icons/md";

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

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Sr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "C.M.",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
];
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ITEM NAME", uid: "item" },
  { name: "START DATE", uid: "rentalStartDate", sortable: true },
  { name: "END DATE", uid: "rentalEndDate", sortable: true },
  { name: "RENTAL OPTION", uid: "rentalOptionId", sortable: true },
  { name: "RENTAL PRICE", uid: "rentalPrice", sortable: true },
  { name: "RENTALSTATUS", uid: "rentalStatus", sortable: true },
];

export default function RentalsTable({
  rentalItems,
}: {
  rentalItems: CustomerRentalItem[];
}) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Key>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
  const [page, setPage] = React.useState(1);

  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/rent-tools");
    }
  }, [isLoggedIn]);


  const handleRowClick = (key: string) => {
    router.push(`/product/${key}/${true}`);
  };

  const filteredItems = React.useMemo(() => {
    let filteredUsers = rentalItems ? [...rentalItems!] : [];

    if (statusFilter !== "all") {
        const filterKeys = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
        
        filteredUsers = filteredUsers.filter((item) =>
          filterKeys.includes(item.rentalStatus)
        );
      }
    return filteredUsers;
  }, [rentalItems, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
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

  const renderCell = React.useCallback(
    (rentalItem: CustomerRentalItem, columnKey: React.Key) => {
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
        //   case "actions":
        //     return (
        //       <div className="relative flex justify-end items-center gap-2">
        //         <Dropdown>
        //           <DropdownTrigger>
        //             <Button isIconOnly size="sm" variant="light">
        //               <BsThreeDots className="text-default-300" />
        //             </Button>
        //           </DropdownTrigger>
        //           <DropdownMenu>
        //             <DropdownItem>View</DropdownItem>
        //             <DropdownItem>Edit</DropdownItem>
        //             <DropdownItem>Delete</DropdownItem>
        //           </DropdownMenu>
        //         </Dropdown>
        //       </div>
        //     );
        default:
          return null;
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  type StatusCounts = Record<string, number>;

    const statusCounts = statusOptions.reduce((acc: StatusCounts, status) => {
    if (status.uid === "all") {
        acc[status.uid] = rentalItems ?rentalItems.length:0;
    } else {
        acc[status.uid] =  rentalItems ? rentalItems.filter(item => item.rentalStatus === status.uid).length:0;
    }
    return acc;
    }, {} as StatusCounts); 

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-3 items-end">
//           <div className="flex gap-3">
//             {/* <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button
//                   endContent={<ArrowDown className="text-small" />}
//                   variant="flat"
//                 >
//                   Status
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Table Columns"
//                 closeOnSelect={false}
//                 selectedKeys={statusFilter}
//                 selectionMode="multiple"
//                 onSelectionChange={setStatusFilter}
//               >
//                 {statusOptions.map((status) => (
//                   <DropdownItem key={status.uid} className="capitalize">
//                     {status.name}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown> */}
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-default-400 text-small">
//             Total {users.length} users
//           </span>
//           <label className="flex items-center text-default-400 text-small">
//             Rows per page:
//             <select
//               className="bg-transparent outline-none text-default-400 text-small"
//               onChange={onRowsPerPageChange}
//             >
//               <option value="8">8</option>
//               <option value="10">10</option>
//               <option value="15">15</option>
//             </select>
//           </label>
//         </div>
//       </div>
//     );
//   }, [onRowsPerPageChange, statusFilter]);


  const bottomContent = React.useMemo(() => {
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
  }, [rentalItems, page, pages]);




  return (
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
                        onRowAction={(key) => handleRowClick(key.toString())}
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
  );
}
