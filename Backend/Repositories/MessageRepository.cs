using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class MessageRepository:GenericRepository<Messages>, IMessageRepository
    {
        public MessageRepository(RentItNowDbContext context, ILogger<GenericRepository<Messages>> logger) :base(context,logger)
        {

        }

        public async Task<IEnumerable<Messages>> GetAllChatMessagesByChatId(Guid chatId)
        {
            try
            {
               var messages = await dbSet.Where((s=>s.ChatId == chatId))
                    .OrderBy(s=>s.Timestamp)
                    .ToListAsync();
               
                return messages.AsEnumerable();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Messages>> MarkAllUnreadMessagesById(string senderId, string receiverId)
        {
            try
            {
                var messages = await dbSet.Where(s => 
                        s.Status == Enums.MessageStatus.Sent && 
                        ((s.SenderId == senderId && s.ReceiverId == receiverId)))
                     .OrderBy(s => s.Timestamp)
                     .ToListAsync();
                if (messages == null)
                {
                    return Enumerable.Empty<Messages>();
                }
                foreach (var message in messages)
                {
                    message.Status = Enums.MessageStatus.Read;
                }
                return messages.AsEnumerable();
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
