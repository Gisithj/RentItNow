using RentItNow.DTOs.User;
using RentItNow.Models;

namespace RentItNow.DTOs.Chat
{
    public class ChatDto
    {
        public Guid Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public string ReceiverId { get; set; } = string.Empty;
        public int UnreadCount { get; set; } = 0;
        public ICollection<Messages> Messages { get; set; } = new List<Messages>();
        public GetUserDto? Sender { get; set; }  = new GetUserDto();
        public GetUserDto? Receiver { get; set; } = new GetUserDto();

    }
}
