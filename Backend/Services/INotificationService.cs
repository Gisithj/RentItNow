using RentItNow.Models;

namespace RentItNow.Services
{
    public interface INotificationService
    {
        public Task<Notification> AddNotification(Notification notification);
        public Task<IEnumerable<Notification>> GetAllNotificationsByUserId(string userId);
        public Task MarkNotificationAsRead(Guid notificationId);
        public Task MarkAllNotificationAsRead(string userId);
    }
}
