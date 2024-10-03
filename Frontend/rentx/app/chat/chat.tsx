import { GET_PREVIOUS_CHAT } from '@/api/messages';
import { setUnreadCount } from '@/lib/features/chatSlice';
import { useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { Customer, Message, MessageStatus, Renter } from '@/utils/interfaces';
import { connection, startConnection, stopConnection } from '@/utils/signalrService';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Input, Spinner } from '@nextui-org/react';
import { set } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5';
import { useSelector } from 'react-redux';


function Chat() { 
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const user = useSelector((state: RootState) => state.auth.user);
    const activeChat = useSelector((state: RootState) => state.chat.activeChat);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    // const connectionRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    
    const senderId = user?.id;
    const reveiverId = activeChat && activeChat.receiverId===user?.id?activeChat.senderId:activeChat?.receiverId;

    
    const startSignalRConnection = async () => {
      await startConnection();
      // connectionRef.current = connection;
    };
    // const startSignalRConnection = async () => {
    //   await startConnection();
    //   connectionRef.current = connection;
    // };

    const sendMessage = async () => {
      if(!message) return;
      const messageDraft ={
        content:message,
        senderId:user?.id,
        receiverId:activeChat && activeChat.receiverId===user?.id? activeChat.senderId: activeChat && activeChat.receiverId,
      }
      
      if (isLoggedIn && user?.id) {
        if( !connection || connection.state !== "Connected") {
          await startSignalRConnection();
        }
        // if( connectionRef.current.state !== "Connected") {
        //   await startSignalRConnection();
        // }
        connection.invoke("SendPrivateMessage", messageDraft);
        setMessage("");
        console.log("message invoked");
      }else{
        console.log("not logged in");
      }
    }

    const handleMessageRead = async () => {
      if (isLoggedIn && user?.id) {
        if( !connection || connection.state !== "Connected") {
          console.log("connection not connected");
          
          await startSignalRConnection();
        }
        // if( !connectionRef.current || connectionRef.current.state !== "Connected") {
        //   console.log("connection not connected");
          
        //   await startSignalRConnection();
        // }
        if(activeChat){
        const senderId = activeChat.receiverId === user.id ? activeChat.senderId : activeChat.receiverId;
        const hasUnreadMessages = messages.findLast(
          message => message.receiverId === user.id && message.status === MessageStatus.SENT
        );        
        
        if(hasUnreadMessages){
          connection.invoke("MessageRead", user.id, (activeChat && activeChat.receiverId===user?.id? activeChat.senderId : activeChat?.receiverId) );
          
        }else{
          console.log("No new messages to read");
        }
      }
      }
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
      if( !connection || connection.state !== "Connected") {
        startSignalRConnection();
      }
         
    const handleNewMessage = (message:Message) =>{
      console.log("ne message",message);
      console.log("achive chat",activeChat);  
           
      if(activeChat && activeChat.id === message.chatId){
        console.log("same chat update");
        console.log("ne message",message.chatId);
        console.log("achive chat",activeChat.id);  
        console.log(activeChat && activeChat.id === message.chatId);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          const unreadCount = user && updatedMessages.filter(msg => msg.receiverId === user.id && msg.status === MessageStatus.SENT).length;
            console.log("called1",unreadCount);
          return updatedMessages;
        });
        const updatedMessages = [...messages, message];
        const unreadCount = user && (updatedMessages.filter(msg => msg.receiverId === user.id && msg.status === MessageStatus.SENT).length??0);
        console.log("called2",unreadCount);
        activeChat && dispatch(setUnreadCount({chatId: message.chatId, count:unreadCount!}))
        
      }else{
        console.log("different chat dispatch");
        activeChat && dispatch(setUnreadCount({chatId: message.chatId, count:1}))
      }
      
    }

      const handleMessageStatusUpdate = (updatedMessages:Message[]) =>{
        console.log("message status update");  
        console.log(updatedMessages[0].chatId);
      
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            const updatedMessage = updatedMessages.find((updatedMsg:Message) => updatedMsg.id === msg.id);
            return updatedMessage ? { ...msg, ...updatedMessage } : msg;
          });
          
      });  
      console.log("message status update dispatch");  
      console.log(activeChat?.id);
          
      activeChat && dispatch(setUnreadCount({chatId: updatedMessages[0].chatId, count:-1}))
        
      }
      connection.on('NewMessage', handleNewMessage);
      connection.on('MessageStatusUpdate', handleMessageStatusUpdate);  

      return () => {
        connection.off('NewMessage', handleNewMessage);
        connection.off('MessageStatusUpdate', handleMessageStatusUpdate); 
          // stopConnection();
        };
    }, [activeChat]);

    useEffect(() => {  
      if(!user) return;    
      const fetchPreviousMessages = async (senderId:string,receiverId:string) => {
        console.log("fetching previous messages");
        try {
          if(activeChat && activeChat.id){
            const response = await GET_PREVIOUS_CHAT(activeChat && activeChat.id);
            setMessages(response);
          }         
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };  
      console.log(user);
      
      user && activeChat && fetchPreviousMessages(user.id, activeChat.id!);
    },[activeChat,user]);

    useEffect(() => {     
      scrollToBottom()
    }, [messages]);

  return (
    
    <div className='flex flex-col gap-4'>
      <h1> {activeChat && user?.id=== activeChat.senderId? activeChat.receiver?.userName : activeChat?.sender.userName}</h1>
      {/* <h1> {activeChat ? ('renterName' in activeChat ? activeChat.renterName : activeChat.name) : null}</h1> */}
      
      {messages && messages.length > 0 ?
      <div className='w-full h-[60vh] overflow-y-scroll'>
        <div className='flex flex-col gap-0.5 w-full px-4 '>
          {messages.map((message, index) => {
            const isLastUserMessage =  message.senderId === user?.id && messages.findLast(message=>message.senderId===user?.id) === message;
            return (        
            <div key={index} className={`flex flex-col w-full ${message.senderId===user?.id?'items-end text-right':'text-left'}`}>
              <p className='w-fit rounded-2xl px-3 py-1 bg-blue-500 text-white'>{message.content}</p>
              { isLastUserMessage &&
              (message.status === MessageStatus.SENT ? <p className='text-xs text-gray-500'>Sent</p> 
              : message.status === MessageStatus.READ ? <p className='text-xs text-gray-500'>Read</p>
              : <p className='text-xs text-gray-500'>Delivered</p>)}
            </div>
          )})}
          <div ref={messagesEndRef} />
        </div>
      </div>
      :
      <div>
        No messages
        </div>
      }
      <Input 
        endContent ={<IoSend onClick={sendMessage} 
        className='cursor-pointer size-6'/>} 
        placeholder="Type your message here" 
        value={message} 
        onValueChange={setMessage}
        onFocus={ handleMessageRead }/>
    </div>
  )
}

export default Chat