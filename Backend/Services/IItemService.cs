using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.Models;
using RentItNow.Repositories;

namespace RentItNow.Services
{
    public interface IItemService
    {
        public Task<Item> GetItemById(Guid id);
        public Task<Item> CreateItem(Item item);
        public Task<IEnumerable<Item>> GetAllItems();
        public Task DeleteItem(Guid id);

        public Task<IEnumerable<Item>> GetAllItemsWithInclude();
        public Task<Item> GetItemByIdWithInclude(Guid id);
    }
}
