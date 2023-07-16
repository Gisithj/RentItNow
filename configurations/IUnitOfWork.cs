using RentItNow.Repository;

namespace RentItNow.configurations
{
    public interface IUnitOfWork
    {
        IRenterRepository Renter { get; set; }
        Task CompleteAsync();
        void Dispose();
    }
}
