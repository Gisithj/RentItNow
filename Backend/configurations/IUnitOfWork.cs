using RentItNow.Interfaces;

namespace RentItNow.configurations
{
    public interface IUnitOfWork
    {
        ICustomerRepository Customer { get; set; }
        IRenterRepository Renter { get; set; }
        IUserRepository User { get; set; }
        IItemRepository Item { get; set; }
        IRentalItemRepository RentalItem { get; set; }
        IRentalOptionRepository RentalOption { get; set; }
        IMessageRepository Messages { get; set; }
        INotificationRepository Notification { get; set; }
        IChatRepository Chat { get; set; }
        Task CompleteAsync();
        void Dispose();
    }
}
