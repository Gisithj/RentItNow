using Microsoft.EntityFrameworkCore;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;
using System.Linq.Expressions;

namespace RentItNow.Services
{
    public interface ICustomerService
    {

        public Task<IEnumerable<Customer>> GetAllCustomersAsync();

    }
}
