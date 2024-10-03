using RentItNow.Enums;

namespace RentItNow.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public NotificationTypes NotificationType { get; set; }
        public string? SenderId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsNotificationRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
