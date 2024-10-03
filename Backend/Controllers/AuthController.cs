using AutoMapper;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.DTOs.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RentItNow.Helpers;
using RentItNow.Models;
using System;
using Microsoft.AspNetCore.Cors;
using RentItNow.DTOs.Customer;
using NuGet.Common;
using RentItNow.DTOs.Renter;
using RentItNow.DTOs.Rent;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;
using RentItNow.DTOs.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using NuGet.Configuration;
using static Microsoft.AspNetCore.Razor.Language.TagHelperMetadata;
using Newtonsoft.Json.Linq;

namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
       // private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly JwtTokenHelper _jwtHelper;
        private readonly RolesHelper _rolesHelpers;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(
            IUnitOfWork unitOfWork, 
            IMapper mapper, 
            JwtTokenHelper jwtHelper,
            RolesHelper rolesHelpers,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            SignInManager<User> signInManager
            )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _rolesHelpers = rolesHelpers;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
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
                }else if (userRoles.Contains(UserRoles.Customer))
                {
                    authClaims.Add(new Claim("customerId", _unitOfWork.Customer.GetCustomerByUserIdAsync(user.Id).Result.CustomerId.ToString()));
                }
                
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                var tokenHandler = await _jwtHelper.GenerateJwtToken(authClaims, 30);
                Response.Cookies.Append("token", tokenHandler, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    //SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddHours(1),
                });
                return Ok(new
                {
                    token = tokenHandler,
                    expiration = 30
                });
            }
            else
            {
               return Unauthorized(new { message = "Invalid username or password" });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Remove the authentication cookie
            if (Request.Cookies.ContainsKey("token"))
            {

                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

                Response.Cookies.Delete("token");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User not logged in token not found." });
            }


            // Return a response indicating successful logout
            return Ok(new { message = "User logged out successfully" });
        }
        [HttpGet("auth-check")]
        public IActionResult CheckAuthentication()
        {
            
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return Ok(new { isAuthenticated = true });
            }
            else
            {
                return Unauthorized(new { isAuthenticated = false });
            }
        }
        [HttpGet("getUser")]
        public async Task<ActionResult<GetUserDto>> GetUser()
        {
            

            // Replace with your token validation logic (using System.IdentityModel.Tokens.Jwt)
            var token = Request.Cookies["token"];

            var principal = _jwtHelper.ValidateJwtToken(token!).validatedToken;
            if (principal == null)
            {
                return Unauthorized("Invalid token");
            }

            var username = principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);
            if (string.IsNullOrEmpty(username?.Value))
            {
                return BadRequest("Username not found in token");
            }

            var user = await _unitOfWork.User.GetUserByUsernameAsync(username.Value);
            var userRoles = await _unitOfWork.User.GetRolesByUserAsync(user);
            string userId = string.Empty;
            foreach (var role in userRoles) {
                if (role.ToLower() == "renter")
                {
                    userId = _unitOfWork.Renter.GetRenterByUserIdAsync(user.Id).Result.RenterId.ToString();
                }
                else if(role.ToLower() ==   "customer")
                {
                    userId = _unitOfWork.Customer.GetCustomerByUserIdAsync(user.Id).Result.CustomerId.ToString();
                }
            }
            var fetchedUser = _mapper.Map<GetUserDto>(user);
            fetchedUser.UserRoles = (ICollection<string>)userRoles;
            
            fetchedUser.roleId = userId;
            if (user == null)
            {
                return NotFound("User not found");
            }

            
            return Ok(fetchedUser); // Return user data
        }

        [HttpPost("register-customer")]
        public async Task<ActionResult<GetCustomerDto>> PostCustomer(CreateCustomerDto customerDto)
        {
            if (_unitOfWork.Customer == null)
            {
                return Problem("Entity set 'RentItNowDbContext.Customers' is null.");
            }

            try
            {
                var user = new User
                {
                    UserName = customerDto.UserName,
                    Email = customerDto.Email,
                    PictureUrl = customerDto.PictureUrl
                };

                var userExists = await _userManager.FindByNameAsync(customerDto.UserName);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                var userCreated = await _userManager.CreateAsync(user, customerDto.Password);

                if (userCreated.Succeeded)
                {
                    await _rolesHelpers.EnsureRolesExist(UserRoles.Customer, UserRoles.User);

                    await _userManager.AddToRolesAsync(user, new[] { UserRoles.Customer, UserRoles.User });

                    var customer = _mapper.Map<Customer>(customerDto);
                    customer.User = user;
                    var customerCreated = await _unitOfWork.Customer.AddAsync(customer);
                    await _unitOfWork.CompleteAsync();

                    var userRoles = await _userManager.GetRolesAsync(user);

                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim("customerId",customerCreated.CustomerId.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };

                    authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                    var token = await _jwtHelper.GenerateJwtToken(authClaims, 30);

                    Response.Cookies.Append("token", token, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddHours(1)
                    });

                    return Ok(token);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
                }
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpPost("register-renter")]
        public async Task<ActionResult<GetRenterDto>> PostRenter(CreateRenterDto renterDto)
        {
            
            if (_unitOfWork.Renter == null)
            {
                return Problem("Entity set 'RentItNowDbContext.Renter'  is null.");
            }
            try
            {
                var user = new User
                {
                    UserName = renterDto.UserName,
                    Email = renterDto.Email,
                    PictureUrl = renterDto.PictureUrl
                };

                var userExists = await _userManager.FindByNameAsync(renterDto.UserName);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                var userCreated = await _userManager.CreateAsync(user, renterDto.Password);

                if (userCreated.Succeeded)
                {
                    await _rolesHelpers.EnsureRolesExist(UserRoles.Customer, UserRoles.User);

                    await _userManager.AddToRolesAsync(user, new[] { UserRoles.Renter, UserRoles.User });

                    var renter = _mapper.Map<Renter>(renterDto);
                    renter.User = user;
                    var renterCreated = await _unitOfWork.Renter.AddAsync(renter);
                    await _unitOfWork.CompleteAsync();

                    var userRoles = await _userManager.GetRolesAsync(user);

                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim("renterId",renterCreated.RenterId.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };

                    authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                    var token = await _jwtHelper.GenerateJwtToken(authClaims, 30);

                    Response.Cookies.Append("token", token, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddHours(1)
                    });

                    return Ok(token);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
                }
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }



        [EnableCors("AllowAnyOrigin")]
        [HttpGet("signin-google")]
        public IActionResult GoogleLogin(string usertype)
        {
            var state = Guid.NewGuid().ToString();
            var callbackUrl = Url.Action("GoogleCallback", new { usertype });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", callbackUrl);
            properties.AllowRefresh = true;
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);

        }

        [EnableCors("AllowAnyOrigin")]
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback(string usertype)
        {
            try
            {
                ExternalLoginInfo info = await _signInManager.GetExternalLoginInfoAsync();
                var signinResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false);
                var email = info.Principal.FindFirstValue(ClaimTypes.Email);
                var user = await _userManager.FindByEmailAsync(email);
                var claims =  info.Principal.Claims.ToList();
                if (signinResult.Succeeded)
                {

                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };

                    var userRoles = await _userManager.GetRolesAsync(user);
                    authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                    var jwt = await _jwtHelper.GenerateJwtToken(authClaims, 30);
                    //var jwt = await _jwtHelper.GenerateJwtToken(claims, 7);

                    var refreshToken = Guid.NewGuid().ToString();

                    await _userManager.SetAuthenticationTokenAsync(
                        user,
                        TokenOptions.DefaultProvider,
                        "RefreshToken",
                        refreshToken);

                    Response.Cookies.Append("token", jwt, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        //SameSite = SameSiteMode.Strict,
                        Expires = DateTime.UtcNow.AddHours(1),
                    });
                    //return Ok(jwt);
                    return Redirect("https://localhost:3000/rent-tools");

                }
                else
                {
                    if (user == null)
                    {

                        var pictureUrl = info.Principal.FindFirstValue("picture");
                        user = new User
                        {
                            UserName = info.Principal.FindFirstValue(ClaimTypes.GivenName),
                            Email = email,
                            EmailConfirmed = true,
                            PictureUrl = pictureUrl
                        };
                        var userCreated = await _userManager.CreateAsync(user);
                        if (userCreated.Succeeded)
                        {
                            if (usertype == "customer")
                            {
                                var customer = new Customer { UserId = user.Id, Email = email, Name = info.Principal.FindFirstValue(ClaimTypes.Name) };
                                await _unitOfWork.Customer.AddAsync(customer);
                                await _userManager.AddToRolesAsync(user, new[] { UserRoles.Customer, UserRoles.User });
                            }
                            else if (usertype == "renter")
                            {
                                var renter = new Renter { UserId = user.Id, RenterName = info.Principal.FindFirstValue(ClaimTypes.Name) };
                                await _unitOfWork.Renter.AddAsync(renter);
                                await _userManager.AddToRolesAsync(user, new[] { UserRoles.Renter, UserRoles.User });
                            }
                            await _rolesHelpers.EnsureRolesExist(UserRoles.Customer, UserRoles.User);                          
                            await _unitOfWork.CompleteAsync();

                        }
                    }
                    await _userManager.AddLoginAsync(user, info);
                    await _signInManager.SignInAsync(user, false);

                    var userRoles = await _userManager.GetRolesAsync(user);
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };
                    
                    authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                    var jwt = await _jwtHelper.GenerateJwtToken(authClaims, 30);

                    var refreshToken = Guid.NewGuid().ToString();

                    await _userManager.SetAuthenticationTokenAsync(
                        user,
                        TokenOptions.DefaultProvider,
                        "RefreshToken",
                        refreshToken);

                    Response.Cookies.Append("token", jwt, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddHours(1),
                    });
                    //return Ok(jwt);

                    return Redirect("https://localhost:3000/rent-tools");
                }

          
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

    }
}
