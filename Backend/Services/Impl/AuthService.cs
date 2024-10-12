using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RentItNow.configurations;
using RentItNow.DTOs.Auth;
using RentItNow.Helpers;
using RentItNow.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RentItNow.Services.Impl
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly JwtTokenHelper _jwtHelper;
        private readonly RolesHelper _rolesHelpers;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<User> _signInManager;

        public AuthService(

            JwtTokenHelper jwtTokenHelper,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            JwtTokenHelper jwtHelper,
            RolesHelper rolesHelpers,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<User> signInManager
            )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _rolesHelpers = rolesHelpers;
        }

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            var result = await _signInManager.PasswordSignInAsync(loginDto.Username, loginDto.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                if (userRoles.Contains(UserRoles.Renter))
                {
                    authClaims.Add(new Claim("renterId", _unitOfWork.Renter.GetRenterByUserIdAsync(user.Id).Result.RenterId.ToString()));
                }
                else if (userRoles.Contains(UserRoles.Customer))
                {
                    authClaims.Add(new Claim("customerId", _unitOfWork.Customer.GetCustomerByUserIdAsync(user.Id).Result.CustomerId.ToString()));
                }

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                var tokenHandler = await _jwtHelper.GenerateJwtToken(authClaims, 30);
                return tokenHandler;
            }
            else
            {
                throw new Exception("Invalid username or password");
            }
        }

     
    }
}
