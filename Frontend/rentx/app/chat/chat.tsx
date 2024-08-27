import { GET_PREVIOUS_CHAT } from '@/api/messages';
import { RootState } from '@/lib/store';
import { Customer, Message, MessageStatus, Renter } from '@/utils/interfaces';
import { connection, startConnection, stopConnection } from '@/utils/signalrService';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Input } from '@nextui-org/react';
import { set } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5';
import { useSelector } from 'react-redux';

interface ChatProps {
  activeChat: Customer | Renter | null;
}
function Chat({activeChat}:ChatProps) {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const user = useSelector((state: RootState) => state.auth.user);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const connectionRef = useRef<any>(null);
    //send a rental request using signalR
    useEffect(() => {
      // const connection = new HubConnectionBuilder()
      //   .withUrl("https://localhost:44375/chat", { withCredentials: true })
      //   .build();
      const startSignalRConnection = async () => {
        await startConnection();
        connectionRef.current = connection;
      }
      startSignalRConnection();

      connection.on('NewMessage', (message) => {
        console.log("message from a customer", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      connection.on('MessageStatusUpdate', (updatedMessages) => {
        console.log("message status update", updatedMessages);
        
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            const updatedMessage = updatedMessages.find((updatedMsg:Message) => updatedMsg.id === msg.id);
            return updatedMessage ? { ...msg, ...updatedMessage } : msg;
          });
        });
      });
  
      return () => {
        stopConnection();
      };
    }, []);

    useEffect(() => {
      
      const fetchPreviousMessages = async (senderId:string,receiverId:string) => {
        try {
          console.log("activeChat",activeChat);
          console.log("user",user);
          
          
          const response = await GET_PREVIOUS_CHAT(user!.id, activeChat!.userId!);
          setMessages(response);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      user && activeChat && fetchPreviousMessages(user.id, activeChat.userId!);
    },[activeChat,user]);


    const sendMessage = () => {
      const messageDraft ={
        content:message,
        senderId:user?.id,
        receiverId:activeChat?.userId,
      }
      
      if (isLoggedIn && user?.id) {
        console.log("gg");
        
        connection.invoke("SendPrivateMessage", messageDraft);
        setMessage("");
        console.log("message invoked");
      }else{
        console.log("not logged in");
      }
    }

    const handleMessageRead = () => {
      console.log("handleMessageRead");
      
      if (isLoggedIn && user?.id) {
        if(messages.some(
          (message: Message) => message.senderId == activeChat?.userId && message.status === MessageStatus.SENT)
        ){
          connection.invoke("MessageRead", user.id, activeChat?.userId);

        }else{
          console.log("No new messages to read");
        }
      }
    }

  return (
    
    <div className='flex flex-col gap-4'>
      <h1> {activeChat ? ('renterName' in activeChat ? activeChat.renterName : activeChat.name) : null}</h1>
      
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
      {/* <button onClick={sendMessage}>Send Message</button> */}
    </div>
  )
}

export default Chat