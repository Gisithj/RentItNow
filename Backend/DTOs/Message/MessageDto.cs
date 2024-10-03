using RentItNow.Enums;

namespace RentItNow.DTOs.Message
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public MessageStatus Status { get; set; }
        public Guid ChatId { get; set; }
    }
}
