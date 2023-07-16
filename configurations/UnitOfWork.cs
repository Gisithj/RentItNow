using AutoMapper;
using RentItNow.Data;
using RentItNow.Repository;
using RentItNow.Services;

namespace RentItNow.configurations
{
    public class UnitOfWork:IUnitOfWork,IDisposable
    {
        private readonly RentItNowDbContext _context;
        private readonly IMapper _mapper;

        public IRenterRepository Renter { get; set; }

        public UnitOfWork(RentItNowDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            Renter = new RenterRepository(context,mapper);

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
