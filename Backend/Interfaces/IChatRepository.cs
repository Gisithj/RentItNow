﻿using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IChatRepository:IGenericRepository<Chat>
    {
        public Task<IEnumerable<Chat>>GetAllChatsByUserId(string userId);
        public Task<Chat> GetChatBySenderAndReceiverId(string senderId, string receiverId);
        public Task<Chat> UpdateUnreadCount(Guid chatId, int number);
        public Task<Chat> UpdateUnreadCount(Guid chatId);

    }
}
