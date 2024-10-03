import api from "@/utils/api";
import { CreateChat } from "@/utils/interfaces";

export const CREATE_CHAT = async (chat:CreateChat) => {
    try {
        const response  = await api.post('/Message/CreateChat',chat);
        return response.data;
    } catch (error) {
        console.log("error fetching previous chat");        
    }
};
export const GET_ALL_CHATS_BY_IDS = async (userId:string) => {
    try {
        const response  = await api.get(`/Message/GetAllChatsByUserId?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.log("error fetching previous chat");        
    }
};
export const GET_PREVIOUS_CHAT = async (chatId:string) => {
    try {
        const response  = await api.get(`/Message/GetPreviousChatMessage?chatId=${chatId}`);
        return response.data;
    } catch (error) {
        console.log("error fetching previous chat");
        
    }
};
export const GET_NOTIFICATIONS = async (userId:string) => {
    try {
        const response  = await api.get(`/Message/GetNotifications?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.log("error fetching previous chat");
        
    }
};
export const MARK_NOTIFICATION_AS_READ = async (id:string,connectionId:string) => {
    try {
        const response  = await api.post('/Message/MarkNotificationAsRead', {id,connectionId});
        return response.data;
    } catch (error) {
        console.log("error marking notification as read");
        
    }
};
export const MARK_ALL_NOTIFICATIONS_AS_READ = async (userId:string,connectionId:string) => {
    try {
        console.log(userId,connectionId);
        
        const request = {
            userId:userId,
            connectionId:connectionId
        }
        const response  = await api.post("/Message/MarkAllNotificationsAsRead", request);
        return response;
    } catch (error) {
        console.log("error marking all notifications as read");
        
    }
};