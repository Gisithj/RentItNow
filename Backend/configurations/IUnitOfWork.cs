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
        Task CompleteAsync();
        void Dispose();
    }
}
