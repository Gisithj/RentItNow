using RentItNow.DTOs.User;
using RentItNow.Models;

namespace RentItNow.DTOs.Chat
{
    public class CreateChatDto
    {
        public string SenderId { get; set; } = string.Empty;
        public string ReceiverId { get; set; } = string.Empty;
    }
}
