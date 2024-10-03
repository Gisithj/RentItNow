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

        public async Task<string> GenerateJwtToken(string userId, string userEmail,int tokenExpirationDays,string role)
        {
            return await Task.Run(() =>
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Email, userEmail),
                    new Claim(ClaimTypes.Role, role), 
                };

            var Sectoken = new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
               _configuration["JwtSettings:Audience"],
                claims,
               expires: DateTime.Now.AddMinutes(tokenExpirationDays),
               signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

            return token;
            });

        }
        public async Task<string> GenerateJwtToken(List<Claim> authClaims, int tokenExpirationDays)
        {
            return await Task.Run(() =>
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            

                var Sectoken = new JwtSecurityToken(
                    _configuration["JwtSettings:Issuer"],
                   _configuration["JwtSettings:Audience"],
                    authClaims,
                   expires: DateTime.Now.AddMinutes(tokenExpirationDays),
                   signingCredentials: credentials);

                var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                return token;
            });
        }


        public (bool isAuthenticated, JwtSecurityToken? validatedToken) ValidateJwtToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime=true,
                    ValidIssuer = _configuration["JwtSettings:Issuer"],
                    ValidAudience = _configuration["JwtSettings:Audience"],
                    IssuerSigningKey = securityKey,
                    // Additional validation parameters as needed
                }, out var validatedToken);

                // Token is valid
                return (true, (JwtSecurityToken) validatedToken);
            }
            catch (Exception ex)
            {
                // Token validation failed
                Console.WriteLine("JWT token validation failed: " + ex.Message);
                return (false,null);
            }
        }
    }
}
