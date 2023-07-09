namespace RentX.Models
{
    public class User
    {
        
        private int UserId { get; set; }
        private string UserName { get; set; } = string.Empty;

        private string Password { get; set; } = string.Empty;
        private string Email { get; set; } = string.Empty;
    }
}
