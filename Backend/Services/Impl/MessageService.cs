using AutoMapper;
using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services.Impl
{
    public class MessageService:IMessageService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MessageService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Messages> AddMessage(Messages message)
        {
            await _unitOfWork.Messages.AddAsync(message);
            await _unitOfWork.CompleteAsync();
            return message;
        }
        public async Task<IEnumerable<Messages>> GetAllChatMessagesBytIds(string senderId, string receiverId)
        {
            try
            {
                var messages = await _unitOfWork.Messages.GetAllChatMessagesByIds(senderId, receiverId);
                return messages;
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
                var messages = await _unitOfWork.Messages.MarkAllUnreadMessagesById(senderId, receiverId);
                await _unitOfWork.CompleteAsync();
                return messages;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
