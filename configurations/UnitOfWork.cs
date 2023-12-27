using AutoMapper;
using Microsoft.AspNetCore.Identity;
using RentItNow.Data;
using RentItNow.Models;
using RentItNow.Repositories;
using RentItNow.Repository;
using RentItNow.Services;

namespace RentItNow.configurations
{
    public class UnitOfWork:IUnitOfWork,IDisposable
    {
        private readonly RentItNowDbContext _context;
        private readonly IMapper _mapper;

        public ICustomerRepository Customer { get; set; }
        public IRenterRepository Renter { get; set; }
        public IUserRepository User { get; set; }
        public IItemRepository Item { get; set; }
        public UnitOfWork(RentItNowDbContext context, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _context = context;
            _mapper = mapper;
            Customer = new CustomerRepository(context);
            Renter = new RenterRepository(context);
            User = new UserRepository(context, userManager,signInManager);

        }
        public async Task CompleteAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        
    }
}
