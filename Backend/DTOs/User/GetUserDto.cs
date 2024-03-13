namespace RentItNow.DTOs.User
{
    public class GetUserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public ICollection<string> UserRoles { get; set; } = new List<string>();
    }
}
