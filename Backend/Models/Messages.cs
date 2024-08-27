using RentItNow.Enums;
using RentItNow.Models;

namespace RentItNow.Models { 
    public class Messages
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string SenderId { get; set; }
        public User Sender { get; set; }
        public string ReceiverId { get; set; }
        public User Receiver { get; set; }
        public Guid ChatId { get; set; }
        public Chat Chat { get; set; } = null!;
        public MessageStatus Status { get; set; } = MessageStatus.Sent;
    }
}
