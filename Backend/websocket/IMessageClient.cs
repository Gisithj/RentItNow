using RentItNow.DTOs.Message;
using RentItNow.Models;

namespace RentItNow.websocket
{
    public interface IMessageClient
    {
        Task UpdateUser(Messages message);
        Task SendMessageToRenter(Guid itemId, Guid customerId);
        Task NewMessage(MessageDto message);
        Task MessageRead(string receiverId,string senderId);
        Task MessageStatusUpdate(List<MessageDto> messages);
        Task NotificationUpdate();
        Task RentalStatusNotification(string message);
    }
}
