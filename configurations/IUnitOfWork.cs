using RentItNow.Repositories;
using RentItNow.Repository;

namespace RentItNow.configurations
{
    public interface IUnitOfWork
    {
        ICustomerRepository Customer { get; set; }
        IRenterRepository Renter { get; set; }
        IUserRepository User { get; set; }
        Task CompleteAsync();
        void Dispose();
    }
}
