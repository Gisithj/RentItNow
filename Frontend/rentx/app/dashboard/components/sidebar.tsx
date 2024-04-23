'use client'
import { setActiveSidebarTab } from '@/lib/features/sidebarSlice';
import { useAppDispatch } from '@/lib/hooks';
import { Listbox, ListboxSection, ListboxItem, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Sidebar() {
  const [activeTab,setActiveTab] = useState("prof-settings")
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const dispatch = useAppDispatch()
  const router = useRouter();
  const handleProfileClick = () =>{
      setActiveTab("prof-settings")
  }
  const handleAccountSettingsClick = () =>{
      setActiveTab("acc-settings")
  }
  const handleSidebarTabClick = (value:string)=>{
    dispatch(setActiveSidebarTab(value))
    router.push(`/dashboard/${value}`) 
    // router.push(`/dashboard/${value}`, { shallow: true })
  }
  return (
    <div className='w-[260px]'>
       <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
            <Listbox variant="flat" aria-label="Listbox menu with sections">
                <ListboxItem
                    key="Home"
                    onPress={()=>handleSidebarTabClick('home')}
                    >
                    Home
                </ListboxItem>
              
                <ListboxItem
                    key="manage-listings"
                    onPress={()=>handleSidebarTabClick('manage-listings')}
                    >
                    Manage listings
                </ListboxItem>
                <ListboxItem
                    key="rental-requests"
                    onPress={()=>handleSidebarTabClick('rental-requests')}
                    >
                    Rental requests
                </ListboxItem>
              
                <ListboxItem
                    key="settings"
                    onPress={()=>handleSidebarTabClick('settings')}
                  //  startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                >
                    Settings
                </ListboxItem>
            </Listbox>
        </div>
    </div>
  )
}

export default Sidebar