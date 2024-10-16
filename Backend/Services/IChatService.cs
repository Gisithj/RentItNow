﻿using RentItNow.Models;

namespace RentItNow.Services
{
    public interface IChatService
    {
        public Task<Chat> CreateChat(Chat chat);
        public Task<Chat> GetChatById(Guid chat);
        public Task<IEnumerable<Chat>> GetAllChatsByUserId(string userId);
        public Task<Chat> GetChatBySenderAndReceiverId(string senderId, string receiverId);
        public Task<Chat> UpdateUnreadCount(Guid chatId, int number);
        public Task<Chat> UpdateUnreadCount(Guid chatId);
    }
}
