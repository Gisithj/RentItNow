using RentItNow.DTOs.Auth;

namespace RentItNow.Services
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginDto loginDto);
    }
}
