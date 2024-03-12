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
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AuthController(
            IUnitOfWork unitOfWork, 
            IMapper mapper, 
            JwtTokenHelper jwtHelper,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration
            )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                var tokenHandler = _jwtHelper.GenerateJwtToken(authClaims, 30);
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
                /*foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var token = _jwtHelper.GenerateJwtToken(user.Id,);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });*/
            }
            return Unauthorized();
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Remove the authentication cookie
            if (Request.Cookies.ContainsKey("token"))
            {
                Response.Cookies.Delete("token");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User not logged in token not found." });
            }


            // Return a response indicating successful logout
            return Ok(new { message = "Logout successful" });
        }
        [HttpGet("auth-check")]
        public IActionResult CheckAuthentication()
        {
            string authorizationHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
            {
                return Unauthorized();
            }

            string token = authorizationHeader.Substring("Bearer ".Length);

            bool isAuthenticated = _jwtHelper.ValidateJwtToken(token);

            if (isAuthenticated)
            {
                return Ok(new { isAuthenticated = true });
            }
            else
            {
                return Unauthorized(new { isAuthenticated = false });
            }
        }

        [HttpPost("register-customer")]
        public async Task<ActionResult<GetCustomerDto>> PostCustomer(CreateCustomerDto customerDto)
        {
            if (_unitOfWork.Customer == null)
            {
                return Problem("Entity set 'RentItNowDbContext.Customers'  is null.");
            }
            try
            {
                var user = _mapper.Map<User>(customerDto);

                var userExists = await _userManager.FindByNameAsync(customerDto.UserName);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                var userCreated = await _unitOfWork.User.CreateUserAsync(user, customerDto.Password);

                if (userCreated.Succeeded)
                {
                    if (!await _roleManager.RoleExistsAsync(UserRoles.Customer))
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.Customer));
                    if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

                    if (await _roleManager.RoleExistsAsync(UserRoles.Customer))
                    {
                        await _userManager.AddToRoleAsync(user, UserRoles.Customer);
                    }
                    if (await _roleManager.RoleExistsAsync(UserRoles.User))
                    {
                        await _userManager.AddToRoleAsync(user, UserRoles.User);
                    }
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.Role,UserRoles.Customer),
                        new Claim(ClaimTypes.Role,UserRoles.User),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                    
                    var customer = _mapper.Map<Customer>(customerDto);
                    customer.User = user;
                    var customerCreated = await _unitOfWork.Customer.AddAsync(customer);
                    await _unitOfWork.CompleteAsync();

                    var tokenHandler = _jwtHelper.GenerateJwtToken(authClaims, 30);
                    Response.Cookies.Append("token", tokenHandler, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite=SameSiteMode.None,
                        //SameSite = SameSiteMode.Strict,
                        Expires = DateTime.UtcNow.AddHours(1), 
                    });

                    return Ok(tokenHandler);
                    //  return CreatedAtAction("GetCustomerById", new { customer.CustomerId }, customer);
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
                if (renterDto == null)
                {
                    return BadRequest();
                }
                var user = _mapper.Map<User>(renterDto);

                var userExists = await _userManager.FindByNameAsync(renterDto.UserName);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                var userCreated = await _unitOfWork.User.CreateUserAsync(user, renterDto.Password);

                if (userCreated.Succeeded)
                {
                    if (!await _roleManager.RoleExistsAsync(UserRoles.Renter))
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.Renter));
                    if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

                    if (await _roleManager.RoleExistsAsync(UserRoles.Renter))
                    {
                        await _userManager.AddToRoleAsync(user, UserRoles.Renter);
                    }
                    if (await _roleManager.RoleExistsAsync(UserRoles.User))
                    {
                        await _userManager.AddToRoleAsync(user, UserRoles.User);
                    }
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.Role,UserRoles.Renter),
                        new Claim(ClaimTypes.Role,UserRoles.User),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };


                    var renter = _mapper.Map<Renter>(renterDto);
                    renter.User = user;
                    var customerCreated = await _unitOfWork.Renter.AddAsync(renter);
                    await _unitOfWork.CompleteAsync();

                    var tokenHandler = _jwtHelper.GenerateJwtToken(authClaims, 30);
                    Response.Cookies.Append("token", tokenHandler, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        //SameSite = SameSiteMode.Strict,
                        Expires = DateTime.UtcNow.AddHours(1),
                    });

                    return Ok(tokenHandler);
                    //  return CreatedAtAction("GetCustomerById", new { customer.CustomerId }, customer);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Renter creation failed! Please check user details and try again." });
                }




            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }



        [HttpGet("signin-google")]
        [EnableCors("AllowAnyOrigin")]
        public IActionResult GoogleLogin()
        {
            var state = Guid.NewGuid().ToString();
            //HttpContext.Session.SetString("GoogleCsrfToken", state);

            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleCallback)),
                Items =
        {
            { "state", state }
        }
            };

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        [EnableCors("AllowAnyOrigin")]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (result?.Succeeded != true)
            {
                return BadRequest("Unable to authenticate with Google");
            }

            // Validate the state parameter
            var state = result.Properties.Items["state"];
            if (state != null && !state.Equals(result.Properties.Parameters["state"]))
            {
                return BadRequest("Invalid state parameter");
            }

            var email = result.Principal.FindFirstValue(ClaimTypes.Email);

            // Check if user exists in your database
            var user = await _unitOfWork.User.GetUserByEmailAsync(email);
            if (user == null)
            {
                // Create new user account if not exists
                user = _mapper.Map<User>(new IdentityUser { UserName = email, Email = email });
                var createUserResult = await _unitOfWork.User.CreateUserAsync(user);
                if (!createUserResult.Succeeded)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create user account");
                }
            }

            // Generate JWT token
            var tokenHandler = _jwtHelper.GenerateJwtToken(user.Id, user.Email, 30, "user");

            return Ok(tokenHandler);
        }
    }
}
