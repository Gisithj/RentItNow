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

        public async Task<IEnumerable<Chat>> GetAllChatsByUserId(string userId)
        {
            try
            {
                var chats = await dbSet
                    .Where(s => s.SenderId == userId || s.ReceiverId == userId)
                    .Include(s=>s.Sender)
                    .Include(s => s.Receiver)
                    .ToListAsync();
                if (chats == null)
                {
                    return null;
                }
                return chats;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Chat> GetChatBySenderAndReceiverId(string senderId, string receiverId)
        {
            try
            {
                
                var isChatExist = await dbSet.AnyAsync(s => (s.SenderId == senderId && s.ReceiverId == receiverId) || (s.SenderId == receiverId && s.ReceiverId == senderId));
                if (!isChatExist)
                {
                    return null;
                }
                else
                {
                    var chat = await dbSet.FirstOrDefaultAsync(s => (s.SenderId == senderId && s.ReceiverId == receiverId) || (s.SenderId == receiverId && s.ReceiverId == senderId));

                    return chat;
                }
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
