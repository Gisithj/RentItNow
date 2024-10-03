import { Chat } from "@/utils/interfaces";
import { createAppSlice } from "../createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";

interface chatState {
    activeChat:Chat | null;
    unreadCount: { [key: string]: number }
}

const initialState : chatState = {
    activeChat: null,
    unreadCount:{}
}
export const chatSlice = createAppSlice({
    name:'chat',
    initialState,
    reducers:{
        setActiveChat : (state, action: PayloadAction<Chat>) => {                              
            state.activeChat = action.payload;            
          },   
        setUnreadCount : (state,action: PayloadAction<{ [key: string]: number } | { chatId: string; count: number }>) =>{
            if ('chatId' in action.payload) {
                const { chatId, count } = action.payload;
                console.log("unread chatId ", chatId);
                console.log("unread count", count);
        
                if (!state.unreadCount.hasOwnProperty(chatId)) {
                  state.unreadCount[chatId] = 0;
                }
                const currentCount = state.unreadCount[chatId] || 0;
        
                if (count === 1) {
                  state.unreadCount[chatId] = currentCount + 1;
                } else if (count === -1) {
                  state.unreadCount[chatId] = 0;
                } else {
                  state.unreadCount[chatId] = count;
                }
              } else {
                state.unreadCount = action.payload;
              }
            
        }
    },
    selectors:{
        activeChat : (chat) => chat.activeChat,
        unreadCount : (chat) => chat.unreadCount
    }
})

export const {setActiveChat,setUnreadCount} = chatSlice.actions;
export const {activeChat,unreadCount} = chatSlice.selectors;