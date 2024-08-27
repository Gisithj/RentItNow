using RentItNow.Models;

namespace RentItNow.Interfaces
{
    public interface INotificationRepository:IGenericRepository<Notification>
    {
        public Task<Notification> AddNotification(Notification notification);
        public Task<IEnumerable<Notification>> GetAllNotificationsByUserId(string userId);
        public Task MarkNotificationAsRead(Guid notificationId);
        public Task MarkAllNotificationAsRead(string userId);
    }
}
