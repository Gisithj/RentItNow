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

namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly JwtTokenHelper _jwtHelper;
        readonly ILogger _logger;
        public AuthController(IUnitOfWork unitOfWork, IMapper mapper, JwtTokenHelper jwtHelper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
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
