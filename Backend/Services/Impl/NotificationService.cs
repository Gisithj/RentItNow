using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services.Impl
{
    public class NotificationService:INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NotificationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Notification> AddNotification(Notification notification)
        {
            await _unitOfWork.Notification.AddAsync(notification);
            await _unitOfWork.CompleteAsync();
            return notification;
        }
        public async Task<IEnumerable<Notification>> GetAllNotificationsByUserId(string userId)
        {
            try
            {
                var notifications = await _unitOfWork.Notification.GetAllNotificationsByUserId(userId);
                return notifications;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
        public async Task MarkNotificationAsRead(Guid notificationId)
        {
            try
            {
                await _unitOfWork.Notification.MarkNotificationAsRead(notificationId);
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
        public async Task MarkAllNotificationAsRead(string userId)
        {
            try
            {
                await _unitOfWork.Notification.MarkAllNotificationAsRead(userId);
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
    }
}
