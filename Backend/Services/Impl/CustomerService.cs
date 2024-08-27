﻿using Microsoft.EntityFrameworkCore;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.Interfaces;
using RentItNow.Models;
using System.Linq.Expressions;

namespace RentItNow.Services
{
    public class CustomerService : ICustomerService
    {
        IUnitOfWork _unitOfWork;
        public CustomerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {

            try
            {
                var customers = await _unitOfWork.Customer.GetAllCustomersWithUserAsync();
                if (customers == null)
                {
                    throw new Exception("no customers not found");
                }
                return customers;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }


    }
}
