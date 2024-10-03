"use client"
import { Button, Table, useDisclosure, Listbox, ListboxSection, ListboxItem, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip, Input, Spinner } from '@nextui-org/react';
import React, { use, useEffect, useState } from 'react'
import { GET_ALL_RENTERS } from '@/api/renter';
import { Chat as IChat, Customer, Renter } from '@/utils/interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { GET_ALL_CUSTOMERS } from '@/api/customer';
import { set } from 'lodash';
import Chat from './chat';
import { CREATE_CHAT, GET_ALL_CHATS_BY_IDS } from '@/api/messages';
import { connection } from '@/utils/signalrService';
import { SearchIcon } from 'lucide-react';
import { setActiveChat, setUnreadCount } from '@/lib/features/chatSlice';
import { useAppDispatch } from '@/lib/hooks';
import { usePathname, useRouter } from 'next/navigation';

function ChatSidebar() {
    const user = useSelector((state: RootState) => state.auth.user);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const {activeChat,unreadCount} = useSelector((state: RootState) => state.chat);
    const [chatList,setChatList] = useState<IChat[]>([])
    const [searchList,setSearchList] = useState<Renter[] | Customer[]>([]);
    // const [activeChat,setActiveChat] = useState<IChat>();
    // const [unreadCount,setUnreadCount] = useState<Map<string,number>>(new Map());
    const [isSearching,setIsSearching] = useState(false);
    const [searchPhrase,setSearchPhrase] = useState("");
    const [newChatCounter, setNewChatCounter] = useState(0);    
    const [isLoading, setIsLoading] = useState(true); 
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const handleChatClick = (activeChatUser:IChat) =>{
      console.log("active chat change called");
      console.log(activeChatUser.id === activeChat?.id);
      console.log(activeChatUser.id);
      
      if(activeChatUser.id === activeChat?.id) return;
      dispatch(setActiveChat(activeChatUser));      
      console.log("active chat changed",activeChatUser.id);

    }

    const handleNewChatClick = async (receiverId:string) =>{
      try {
        if(!user) return;
        await CREATE_CHAT({senderId:user?.id,receiverId:receiverId}).then((data)=>{
          handleSearchClear();
          dispatch(setActiveChat(data));
          setNewChatCounter((prev) => prev + 1);
        }).catch((error)=>{ 
          console.log("error creating chat",error);
        })
        
      } catch (error) {
        
      }
    }
 
    
    useEffect(() => {

      if(user){
       
        GET_ALL_CHATS_BY_IDS(user.id).then((data)=>{
          setChatList(data);         
          
          activeChat == null && dispatch(setActiveChat(data[0]));  
          const unreadCount: { [key: string]: number } = {};
            data.forEach((chat: IChat) => {
                console.log("chat",chat);
                
                unreadCount[chat.id] = chat.unreadCount;
            });
          console.log("initialize unread counts",unreadCount);
          dispatch(setUnreadCount(unreadCount));
        })
        
      }
      
    }, [user,newChatCounter,activeChat])

    const handleSearchClear = () =>{
      setIsSearching(false);
      setSearchPhrase("");
    }

    useEffect(()=>{
      if(searchPhrase === ""){
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const handleSearch = async () =>{
        console.log("searching for ",searchPhrase);        
        if(user?.userRoles.includes("Renter")){
          const customers = await GET_ALL_CUSTOMERS();
          const filteredCustomer = customers.filter((customer:Customer)=>customer.name.toLowerCase().includes(searchPhrase.toLowerCase()))
          setSearchList(filteredCustomer)

        }else{
          const renters = await GET_ALL_RENTERS();
          const filteredRenters = renters.filter((renter:Renter)=>renter.renterName.toLowerCase().includes(searchPhrase.toLowerCase()))

          setSearchList(filteredRenters)
        }
        
      } 
      handleSearch()
    },[searchPhrase])

       
    useEffect(()=>{
      // if (!isLoggedIn) router.push('/auth/sign-in')      

      if(!isLoggedIn){        
        router.push(`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`);
      }else{
        
        setIsLoading(false)
      }
     },[isLoggedIn])


  

  return (
    isLoading ?
      <div className='w-full h-full place-content-center'><Spinner/></div>
      :
      <div className='px-4 md:px-44 py-4 md:py-20 flex flex-row gap-10'>
      <div className="w-full h-fit max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        
      <Input
      isClearable
      onClear={handleSearchClear}
      radius="lg"
      size='md'
      value={searchPhrase}
      placeholder={`Search for a ${user?.userRoles.includes("Renter")?'customer':'renter'}...`}
      startContent={
        <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      }
      onValueChange={setSearchPhrase}
      />
      {isSearching ?
          <Listbox variant="flat" aria-label="Listbox menu with sections">
              {searchList.map((newchat,index)=>(
              <ListboxItem
                  key={index}
                  onClick={()=>handleNewChatClick(newchat!.userId!)}
                  >
                  <div className='flex flex-col gap-4'>
                 
                  <p>{user ? ('renterName' in newchat ? newchat.renterName : newchat.name) : null}</p>
                           
                  </div>
              </ListboxItem>
              ))}                
          </Listbox>
      :
          <Listbox variant="flat" aria-label="Listbox menu with sections">
            {chatList && chatList.map((chat,index)=>(
            <ListboxItem
                key={index}
                onClick={()=>handleChatClick(chat)}
                className={`flex flex-row h-12 gap-4 items-center ${activeChat?.id === chat.id ? 'bg-primary-300 dark:bg-primary' : ''}`}
                

                >
                <div className='flex flex-row gap-4 items-center'>
                  <p className={`${activeChat?.id === chat.id ? 'text-primary-foreground' : 'text-primary-background'}`}>{user?.id===chat.senderId?chat.receiver.userName:chat.sender.userName}</p>
                  {/* <p>{user ? ('renterName' in user ? user.renterName : user.name) : null}</p> */}
                  {(unreadCount[chat.id] ?? 0) > 0 && (
                    <Chip variant='solid' size="sm" color='secondary'>{unreadCount[chat.id]}</Chip>
                  )}               
                </div>
            </ListboxItem>
            ))}
              
          </Listbox>  
      }

      </div>
      <div className='w-2/3'>
          <div className='flex flex-col gap-10'>

              <div>
                {activeChat ?
                    <Chat/>
                    // <Chat activeChat={activeChat} handleUnreadCountUpdate={handleUnreadCountUpdate}/>
                :
                  <div>No active chat</div>
                }
              </div>
          </div>
      </div>
  </div>
  
  )
}

export default ChatSidebar