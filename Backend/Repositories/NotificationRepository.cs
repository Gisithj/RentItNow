using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;

namespace RentItNow.Repositories
{
    public class NotificationRepository:GenericRepository<Notification>, INotificationRepository
    {
        public NotificationRepository(RentItNowDbContext context, ILogger<GenericRepository<Notification>> logger) : base(context, logger)
        {

        }

        public async Task<Notification> AddNotification(Notification notification)
        {
            try
            {
                await dbSet.AddAsync(notification);
                return notification;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message) ;
            }
            
        }

        public async Task<IEnumerable<Notification>> GetAllNotificationsByUserId(string userId)
        {
            try
            {
                var notifications = await dbSet.Where(n => n.UserId == userId && n.IsNotificationRead==false).ToListAsync();
                return notifications.AsEnumerable();
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
                var notifications = await dbSet.Where(n => n.UserId == userId && n.IsNotificationRead == false).ToListAsync();
                foreach (var notification in notifications)
                {
                    notification.IsNotificationRead = true;
                }
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
                var notification = await dbSet.FirstOrDefaultAsync(n => n.Id == notificationId);
                if(notification != null)
                {
                    notification.IsNotificationRead = true;
                }
                else
                {
                    throw new Exception("Notification not found");
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
