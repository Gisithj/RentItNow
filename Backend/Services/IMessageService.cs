using RentItNow.Models;

namespace RentItNow.Services
{
    public interface IMessageService
    {
        public Task<Messages> AddMessage(Messages message);
        public Task<IEnumerable<Messages>> GetAllChatMessagesBytIds(string senderId, string receiverId);
        public Task<IEnumerable<Messages>> MarkAllUnreadMessagesById(string senderId, string receiverId);

    }
}
