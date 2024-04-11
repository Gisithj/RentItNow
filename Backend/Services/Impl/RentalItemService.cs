using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.Models;

namespace RentItNow.Services
{
    public class RentalItemService : IRentalItemService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RentalItemService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task RentItemAsync(RentalItem rentalItem)
        {
            
            try
            {
                var item = await _unitOfWork.Item.GetByIdAsync(rentalItem.ItemID);
                var customer = await _unitOfWork.Customer.GetByIdAsync(rentalItem.CustomerId);
                var renter = await _unitOfWork.Renter.GetByIdAsync(rentalItem.RenterId);
                if (item == null)
                {
                    throw new ArgumentException("Item not found.", nameof(rentalItem.ItemID));
                }
                if (customer == null)
                {
                    throw new ArgumentException("Customer not found.", nameof(rentalItem.CustomerId));
                }
                if (item.IsRented)
                {
                    throw new InvalidOperationException("Item is already rented.");
                }
                if (renter == null)
                {
                    throw new ArgumentException("Renter not found.", nameof(rentalItem.RenterId));
                }
                item.IsRented = true;
                customer.RentedItems.Add(rentalItem);
                renter.RentalItems.Add(rentalItem);

                await _unitOfWork.Item.UpdateAsync(item);
                await _unitOfWork.RentalItem.AddAsync(rentalItem);
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
          
        }
    }
}
