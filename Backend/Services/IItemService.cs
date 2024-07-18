using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.DTOs.Item;
using RentItNow.Models;
using RentItNow.Repositories;

namespace RentItNow.Services
{
    public interface IItemService
    {
        public Task<Item> GetItemById(Guid id);
        public Task<Item> CreateItem(Item item);
        public Task<Item> UpdateItem(UpdateItemDto item);
        public Task<IEnumerable<Item>> GetAllItems();
        public Task DeleteItem(Guid id);
        public Task<IEnumerable<Item>> GetAllItemsWithInclude();
        public Task<IEnumerable<Item>> GetAllItemsByRenterWithInclude(Guid renterId);
        public Task<IEnumerable<Item>> GetAllItemsWithIncludePagedAsync(int pageNumber,int pageSize);
        public Task<Item> GetItemByIdWithInclude(Guid id);
        public Task<IEnumerable<Item>> GetAllAvailableItemsByDateRangeWithInclude(DateTimeOffset rentalStartDate, DateTimeOffset rentalEndDate, int pageNumber, int pageSize);
    }
}
