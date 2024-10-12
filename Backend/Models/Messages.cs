using RentItNow.Enums;
using RentItNow.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models { 
    public class Messages
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty; 
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public string SenderId { get; set; } = string.Empty;
        public User Sender { get; set; } = null!;
        public string ReceiverId { get; set; } = string.Empty;
        public User Receiver { get; set; } = null!;
        public Guid ChatId { get; set; } = Guid.Empty;
        public Chat Chat { get; set; } = null!;
        public MessageStatus Status { get; set; } = MessageStatus.Sent;
    }
}
