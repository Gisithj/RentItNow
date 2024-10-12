using RentItNow.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.Models
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public NotificationTypes? NotificationType { get; set; } 
        public string? SenderId { get; set; } 
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsNotificationRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
