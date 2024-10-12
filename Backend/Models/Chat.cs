using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class Chat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public User Sender { get; set; } = null!;
        public string ReceiverId { get; set; } = string.Empty;
        public User Receiver { get; set; } = null!;
        public ICollection<Messages> Messages { get; set; } = new List<Messages>();
        public int UnreadCount{ get; set; } = 0;
    }
}
