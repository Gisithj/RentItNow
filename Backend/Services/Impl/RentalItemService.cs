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

        public async Task UpdateRentalItem(IEnumerable<RentalItem> rentalItems)
        {
            try
            {
               _unitOfWork.RentalItem.UpdateRentalItem(rentalItems);
               await _unitOfWork.CompleteAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<IEnumerable<RentalItem>?> GetAllRentalItems()
        {

            var rentalItems = await _unitOfWork.RentalItem.GetAllAsync();
            if (rentalItems == null || rentalItems.Count() == 0)
            {
                return null;
            }
            return rentalItems;
        }

        public async Task<bool> IsAvailableForRent(Guid itemId, DateTimeOffset startDate, DateTimeOffset endDate)
        {
            return await _unitOfWork.RentalItem.IsRentalAvailable(itemId, startDate, endDate);
        }

        public async Task<bool> RentItemAsync(RentalItem rentalItem)
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
                if (item.RentalStatus == Enums.RentalStatus.Rented)
                {
                    throw new InvalidOperationException("Item is already rented.");
                }
                if (renter == null)
                {
                    throw new ArgumentException("Renter not found.", nameof(rentalItem.RenterId));
                }
                if (_unitOfWork.RentalItem.IsRentalAvailable(rentalItem.ItemID, rentalItem.RentalStartDate, rentalItem.RentalEndDate).Result)
                {
                    //item.IsRented = true;
                    if(rentalItem.RentalStartDate == DateTimeOffset.Now)
                    {
                       item.RentalStatus = Enums.RentalStatus.Rented;
                       rentalItem.rentalStatus = Enums.RentalStatus.Rented;
                    }
                    else
                    {
                       item.RentalStatus = Enums.RentalStatus.Reserved;
                       rentalItem.rentalStatus = Enums.RentalStatus.Reserved;
                    }
                    customer.RentedItems.Add(rentalItem);
                    renter.RentalItems.Add(rentalItem);

                    await _unitOfWork.Item.UpdateAsync(item);
                    await _unitOfWork.RentalItem.AddAsync(rentalItem);
                    await _unitOfWork.CompleteAsync();
                    return true;
                }
                else
                {

                    return false;
                }
                
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
          
        }

        public async Task EndRentItemAsync(Guid itemId,Guid rentalItemId)
        {

            try
            {
                var item = await _unitOfWork.Item.GetByIdAsync(itemId);
                var rentalItem = await _unitOfWork.RentalItem.GetByIdAsync(rentalItemId);

                item.IsRented = false;
                item.RentalStatus = Enums.RentalStatus.Available;
                rentalItem.rentalStatus = Enums.RentalStatus.Available;
                rentalItem.isRentOver = true;

                await _unitOfWork.Item.UpdateAsync(item);
                //await _unitOfWork.RentalItem.AddAsync(rentalItem);
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }

        }

        public async Task<IEnumerable<RentalItem>> GetAllRentedItemsByRenterWithIncludeAsync(Guid renterId)
        {
            try
            {
                var allItems = await _unitOfWork.RentalItem.GetAllRentedItemsByRenterWithIncludeAsync(renterId);
                return allItems;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async void DeleteRentalItemsBytItemId(Guid itemId)
        {
            try
            {
                await _unitOfWork.RentalItem.DeleteRentalItemsBytItemId(itemId);
                //await _unitOfWork.CompleteAsync();
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
    }
}
