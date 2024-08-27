using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class ChatRepository:GenericRepository<Chat>, IChatRepository
    {
        public ChatRepository(RentItNowDbContext context,ILogger<GenericRepository<Chat>> logger):base(context,logger)
        {
            
        }

        public async Task<Chat> GetChatBySenderAndReceiverId(string senderId, string receiverId)
        {
            try
            {
                var chat = await dbSet.FirstOrDefaultAsync(s => s.SenderId == senderId && s.ReceiverId == receiverId);
                if(chat == null)
                {
                    return null;
                }
                return chat;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Chat> UpdateUnreadCount(Guid chatId,int number )
        {
            try
            {
                var chat = await dbSet.FirstOrDefaultAsync(c=>c.Id == chatId);
                if(chat == null)
                {
                    return null;
                }
                chat.UnreadCount+=number;
                return chat;
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<Chat> UpdateUnreadCount(Guid chatId)
        {
            try
            {
                var chat = await dbSet.FirstOrDefaultAsync(c => c.Id == chatId);
                if (chat == null)
                {
                    return null;
                }
                chat.UnreadCount = 0;
                return chat;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
