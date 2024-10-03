using AutoMapper;
using Microsoft.AspNetCore.Identity;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;
using RentItNow.Repositories;
using RentItNow.Services;

namespace RentItNow.configurations
{
    public class UnitOfWork:IUnitOfWork,IDisposable
    {
        private readonly RentItNowDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILoggerFactory _loggerFactory;

        public ICustomerRepository Customer { get; set; }
        public IRenterRepository Renter { get; set; }
        public IUserRepository User { get; set; }
        public IItemRepository Item { get; set; }
        public IRentalItemRepository RentalItem { get; set; }
        public IRentalOptionRepository RentalOption { get; set; }
        public IMessageRepository Messages { get; set; }
        public INotificationRepository Notification { get; set; }
        public IChatRepository Chat { get; set; }
        public IRenterConfigRepository RenterConfig { get; set; }
        public UnitOfWork(
            RentItNowDbContext context, 
            IMapper mapper, 
            UserManager<User> userManager, 
            SignInManager<User> signInManager, 
            ILoggerFactory loggerFactory)
        {
            _context = context;
            _mapper = mapper;
            Customer = new CustomerRepository(context,loggerFactory.CreateLogger<GenericRepository<Customer>>());
            Renter = new RenterRepository(context, loggerFactory.CreateLogger<GenericRepository<Renter>>());
            User = new UserRepository(context, userManager, signInManager, loggerFactory.CreateLogger<GenericRepository<User>>());
            Item = new ItemRepository(context, loggerFactory.CreateLogger<GenericRepository<Item>>());
            RentalItem = new RentalItemRepository(context, loggerFactory.CreateLogger<GenericRepository<RentalItem>>());
            RentalOption = new RentalOptionRepository(context, loggerFactory.CreateLogger<GenericRepository<RentalOption>>());
            Messages = new MessageRepository(context, loggerFactory.CreateLogger<GenericRepository<Messages>>());
            Notification = new NotificationRepository(context, loggerFactory.CreateLogger<GenericRepository<Notification>>());
            Chat = new ChatRepository(context, loggerFactory.CreateLogger<GenericRepository<Chat>>());
            RenterConfig = new RenterConfigRepository(context, loggerFactory.CreateLogger<GenericRepository<RenterConfig>>());
            _loggerFactory = loggerFactory;
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
