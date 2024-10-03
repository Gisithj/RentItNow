using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.Helpers;
using RentItNow.Interfaces;
using RentItNow.Models;
using RentItNow.Repositories;

namespace RentItNow.Services
{
    public class RenterService : IRenterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly JwtTokenHelper _jwtHelper;
        public RenterService(IUnitOfWork unitOfWork,IMapper mapper, JwtTokenHelper jwtHelper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
        }

        public async Task<string> CreateRenterAsync(User user, CreateRenterDto createRenterDto)
        {
            try
            {
                var renterExists = await _unitOfWork.Renter.GetRenterByUsernameAsync(createRenterDto.RenterName);
                if (renterExists != null)
                {
                    throw new Exception("renter already exists");
                }
                var userCreated = await _unitOfWork.User.CreateUserAsync(user, createRenterDto.Password);
                var renter = _mapper.Map<Renter>(createRenterDto);
                renter.UserId = user.Id;
                renter.User = user;
                var renterCreated = await _unitOfWork.Renter.AddAsync(renter);
                var renterConfig = await _unitOfWork.RenterConfig.AddAsync(new RenterConfig { RenterId = renterCreated.RenterId,Renter=renterCreated });
                await _unitOfWork.CompleteAsync();
                var tokenHandler = await _jwtHelper.GenerateJwtToken(renterCreated.RenterId.ToString(), user.Email, 30, "renter");

                return tokenHandler;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<Renter>> GetAllRentersAsync()
        {

            try
            {
                var renters = await _unitOfWork.Renter.GetAllRentersWithUserAsync();
                return renters;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

  


    }
}
