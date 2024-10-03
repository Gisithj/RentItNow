using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface IMessageRepository:IGenericRepository<Messages>
    {
        public Task<IEnumerable<Messages>> GetAllChatMessagesByChatId(Guid chatId);
        public Task<IEnumerable<Messages>> MarkAllUnreadMessagesById(string senderId, string receiverId);
    }
}
