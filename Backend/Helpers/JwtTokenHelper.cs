using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RentItNow.Models;

namespace RentItNow.Helpers
{
    public class JwtTokenHelper
    {
        private readonly IConfiguration _configuration;

        public JwtTokenHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(string userId, string userEmail,int tokenExpirationDays,string role)
        {
            
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, userId),
                    new Claim(ClaimTypes.Email, userEmail),
                    new Claim(ClaimTypes.Role, role), 
                };

            var Sectoken = new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
               _configuration["JwtSettings:Issuer"],
                claims,
               expires: DateTime.Now.AddMinutes(tokenExpirationDays),
               signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

            return token;
          
        }
    }
}
