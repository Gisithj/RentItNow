"use client"
import { Button, Table, useDisclosure, Listbox, ListboxSection, ListboxItem, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import React, { use, useEffect, useState } from 'react'
import Chat from './chat';
import { GET_ALL_RENTERS } from '@/api/renter';
import { Customer, Renter } from '@/utils/interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { GET_ALL_CUSTOMERS } from '@/api/customer';
import { set } from 'lodash';

function ChatSidebar() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [issaRenter,setIssaRenter] = useState(false)
    const [activeTab,setActiveTab] = useState("prof-settings")
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [chatList,setChatList] = useState<Renter[] | Customer[]>([])
    const [activeChat,setActiveChat] = useState<Renter | Customer | null>(null)
    const [unreadCount,setUnreadCount] = useState(0)
    const [messageList,setMessageList] = useState<Map<Renter|Customer|null,number>>(new Map())
    const handleChatClick = (activeChatUser:Renter| Customer) =>{
      setActiveChat(activeChatUser);
    }
    const handleUnreadCountUpdate = (user:Renter|Customer,count:number) =>{
      setMessageList((prevMessageList) => {
        prevMessageList.set(user,count);
        return prevMessageList;
      })
    }
    useEffect(() => {
      if(user?.userRoles.includes("Renter")){
        console.log("customer");
        
        GET_ALL_CUSTOMERS().then((data)=>{
          setIssaRenter(false);
          setChatList(data);
          setActiveChat(data[0]);

        })
      }else{
        GET_ALL_RENTERS().then((data)=>{
          setIssaRenter(true);
          setChatList(data);
          setActiveChat(data[0]);        
        })
      }
      
    }, [user])

    // useEffect(() => {
    //   console.log("activeChat",activeChat);
      
    // }, [activeChat])
  return (
    <div className='px-4 md:px-44 py-4 md:py-20 flex flex-row gap-10'>
        <div className="w-full h-fit max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
            <Listbox variant="flat" aria-label="Listbox menu with sections">
                {chatList.map((user,index)=>(
                <ListboxItem
                    key={index}
                    //description="Create a new file"
                    onClick={()=>handleChatClick(user)}
                    >
                    <div className='flex flex-col gap-1'>
                    <p>{user ? ('renterName' in user ? user.renterName : user.name) : null}</p>
                    <p>No new messages</p>
                    </div>
                </ListboxItem>
                ))}
                
            </Listbox>
        </div>
        <div className='w-2/3'>
            <div className='flex flex-col gap-10'>
                <div className='text-2xl font-bold'>{activeTab==="prof-settings"?"Gisith Jayawardena":activeTab==="acc-settings"?'Settings':''}</div>

                <div>
                  <Chat activeChat={activeChat}/>

                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatSidebar