using Microsoft.AspNetCore.Identity;
using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services.Impl
{
    public class ChatService:IChatService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        public ChatService(IUnitOfWork unitOfWork, UserManager<User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _userManager = userManager;
        }

        public async Task<Chat> CreateChat(Chat chat)
        {
            try
            {
                if(chat.Sender == null && chat.Receiver == null)
                {
                   chat.Sender = await _userManager.FindByIdAsync(chat.SenderId);
                   chat.Receiver = await _userManager.FindByIdAsync(chat.ReceiverId);
                }
                var isAlreadyExist = await _unitOfWork.Chat.GetChatBySenderAndReceiverId(chat.SenderId, chat.ReceiverId);
                if(isAlreadyExist != null)
                {
                    return isAlreadyExist;
                }
                await _unitOfWork.Chat.AddAsync(chat);
                await _unitOfWork.CompleteAsync();
                return chat;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<Chat> GetChatById(Guid chatId)
        {
            try
            {
                var chat = await _unitOfWork.Chat.GetByIdAsync(chatId);
                return chat;
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<IEnumerable<Chat>> GetAllChatsByUserId(string userId)
        {
            try
            {
                var chat = await _unitOfWork.Chat.GetAllChatsByUserId(userId);
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
