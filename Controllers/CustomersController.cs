using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.DTOs.Customer;
using RentItNow.DTOs.Rent;
using RentItNow.Models;

namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CustomersController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCustomerDto>>> GetCustomers()
        {
            try
            {
                var customers = await _unitOfWork.Customer.GetAllAsync();


                if (customers.Count() == 0)
                {
                    return NotFound("Renters not found");
                }

                List<GetCustomerDto> customersDtoList = new List<GetCustomerDto>();

                foreach (Customer renter in customers)
                {
                    var customersDto = _mapper.Map<GetCustomerDto>(renter);
                    customersDtoList.Add(customersDto);

                }
                return customersDtoList;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetCustomerDto>> GetCustomerById(Guid id)
        {
          try
            {
                var customer = await _unitOfWork.Customer.GetByIdAsync(id);
                var customerDto = _mapper.Map<GetCustomerDto>(customer);
                return customerDto;

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(Guid id, UpdateCustomerDto updateCustomer)
        {
            
            if (updateCustomer == null)
            {
                return BadRequest();
            }
            var existingCustomer = await _unitOfWork.Customer.GetByIdAsync(id);
            if (existingCustomer == null)
            {
                return BadRequest();
            }
            Customer customer = _mapper.Map(updateCustomer, existingCustomer);

            var updatedCustomer = await _unitOfWork.Customer.UpdateAsync(customer);
            if (updateCustomer == null)
            {
                return NoContent();
            }
            await _unitOfWork.CompleteAsync();
            return Ok(updateCustomer);
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GetCustomerDto>> PostCustomer(CreateCustomerDto customerDto)
        {
          if (_unitOfWork.Customer == null)
          {
              return Problem("Entity set 'RentItNowDbContext.Customers'  is null.");
          }
            try
            {
                var user = _mapper.Map<User>(customerDto);
                var userCreated = await _unitOfWork.User.CreateUserAsync(user, customerDto.Password);
                if (userCreated.Succeeded)
                {
                    var customer = _mapper.Map<Customer>(customerDto);
                    customer.User = user;
                    var customerCreated = await _unitOfWork.Customer.AddAsync(customer);
                    await _unitOfWork.CompleteAsync();
                    return CreatedAtAction("GetCustomerById", new { customer.CustomerId }, customer);
                }
                else
                {
                    return BadRequest("User not created");
                }




            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            try
            {

                await _unitOfWork.Customer.DeleteAsync(id);
                await _unitOfWork.CompleteAsync();
                return Ok("Customer deleted");
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

    }
}
