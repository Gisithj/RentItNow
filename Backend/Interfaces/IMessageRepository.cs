using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IMessageRepository:IGenericRepository<Messages>
    {
        public Task<IEnumerable<Messages>> GetAllChatMessagesByIds(string senderId, string receiverId);
        public Task<IEnumerable<Messages>> MarkAllUnreadMessagesById(string senderId, string receiverId);
    }
}
