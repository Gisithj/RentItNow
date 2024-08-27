using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services.Impl
{
    public class ChatService:IChatService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ChatService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Chat> CreateChat(Chat chat)
        {
            try
            {
                await _unitOfWork.Chat.AddAsync(chat);
                await _unitOfWork.CompleteAsync();
                return chat;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<Chat> GetChatBySenderAndReceiverId(string senderId, string receiverId)
        {
            try
            {
                var chat = await _unitOfWork.Chat.GetChatBySenderAndReceiverId(senderId, receiverId);
                return chat;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Chat> UpdateUnreadCount(Guid chatId, int number)
        {
            try
            {
                var chat = await _unitOfWork.Chat.UpdateUnreadCount(chatId,number);
                await _unitOfWork.CompleteAsync();
                return chat;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<Chat> UpdateUnreadCount(Guid chatId)
        {
            try
            {
                var chat = await _unitOfWork.Chat.UpdateUnreadCount(chatId);
                await _unitOfWork.CompleteAsync();
                return chat;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


    }
}
