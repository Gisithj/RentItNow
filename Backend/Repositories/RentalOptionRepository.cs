using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.DTOs.Item;
using RentItNow.DTOs.RentalOption;
using RentItNow.Interfaces;
using RentItNow.Models;
using System.Collections.Generic;
using System.Linq;

namespace RentItNow.Repositories
{
    public class RentalOptionRepository : GenericRepository<RentalOption>, IRentalOptionRepository
    {
        public RentalOptionRepository(RentItNowDbContext context, ILogger<GenericRepository<RentalOption>> logger) : base(context, logger)
        {
        }

        public async Task<List<GetRentalOptionDto>> GetAllRentalOptions()
        {
            var rentalOptions = await dbSet.Select(r => new GetRentalOptionDto { Id = r.Id, RentalOptionName = r.RentalOptionName }).ToListAsync();
            return rentalOptions;
        }

        public async Task<string> GetRentalOptionNameByIdAsync(Guid rentalOptionId)
        {
            var rentalOption = await dbSet.Where(r => r.Id == rentalOptionId).FirstOrDefaultAsync();
            if (rentalOption == null)
            {
                return string.Empty;
            }
            return rentalOption.RentalOptionName;
        }
    }
}
