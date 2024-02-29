using RentItNow.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentItNow.DTOs.Customer
{
    public class CreateCustomerDto
    {
       
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

    }
}
