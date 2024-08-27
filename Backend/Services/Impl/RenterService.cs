using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.DTOs.Rent;
using RentItNow.Models;
using System.Configuration;

namespace RentItNow.Services
{
    public class RenterService : IRenterService
    {
        IUnitOfWork _unitOfWork;
        public RenterService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Renter>> GetAllRentersAsync()
        {

            try
            {
                var renters = await _unitOfWork.Renter.GetAllRentersWithUserAsync();
                if (renters == null)
                {
                    throw new Exception("not renters not found");
                }
                return renters;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        //public async Task<Renter> GetRenterByUserIdAsync(string userId)
        //{

        //    try
        //    {
        //        var renter = await dbSet
        //                        .Where(r => r.User.Id == userId)
        //                        .FirstOrDefaultAsync();
        //        if (renter == null)
        //        {
        //            throw new Exception("renter not found");
        //        }
        //        return renter;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw new Exception(ex.Message);
        //    }

        //}


    }
}
