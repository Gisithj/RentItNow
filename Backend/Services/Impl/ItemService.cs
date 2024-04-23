using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.DTOs.Item;
using RentItNow.Models;
using RentItNow.Repositories;

namespace RentItNow.Services
{
    public class ItemService : IItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ItemService(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;

        }

        public async Task<Item> GetItemById(Guid id)
        {
            var item = await _unitOfWork.Item.GetByIdAsync(id);
            if (item == null)
            {
                throw new Exception("Item not found");
            }
            return item;
        }
        public async Task<Item> CreateItem(Item item)
        {
            await _unitOfWork.Item.AddAsync(item);
            await _unitOfWork.CompleteAsync();
            return item;
        }
        public async Task<Item> UpdateItem(UpdateItemDto updatedItem)
        {
            if (updatedItem == null )
            {
                throw new Exception("Item not found");
            }
            var itemToUpdate = await _unitOfWork.Item.GetItemWithIncludeByIdAsync(updatedItem.ItemId);
            if (itemToUpdate == null)
            {
                throw new Exception("No existing item not found");
            }
            _mapper.Map(updatedItem,itemToUpdate);
            var itemUpdated = await _unitOfWork.Item.UpdateAsync(itemToUpdate);

            await _unitOfWork.CompleteAsync();
            return itemUpdated;
        }
        public async Task<IEnumerable<Item>> GetAllItems()
        {
            var items = await _unitOfWork.Item.GetAllAsync();
            if(items == null || items.Count() == 0)
            {
                throw new Exception("Items not found");
            }
            return items;
        }
       
        public async Task<IEnumerable<Item>> GetAllItemsWithInclude()
        {
            var items = await _unitOfWork.Item.GetAllItemsWithIncludeAsync();
            if (items == null || items.Count() == 0)
            {
                throw new Exception("Items not found");
            }
            return items;
        }

        public async Task<Item> GetItemByIdWithInclude(Guid id)
        {
            var item = await _unitOfWork.Item.GetItemWithIncludeByIdAsync(id);
            if (item == null)
            {
                throw new Exception("Item not found");
            }
            return item;
        }
        public async Task DeleteItem (Guid id)
        {
            var item = await _unitOfWork.Item.GetByIdAsync(id);
            if (item == null)
            {
                throw new Exception("Item not found");
            }
            await _unitOfWork.Item.DeleteAsync(id);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IEnumerable<Item>> GetAllItemsByRenterWithInclude(Guid renterId)
        {
            var items = await _unitOfWork.Item.GetAllItemsByRenterWithIncludeAsync(renterId);
            if (items == null || items.Count() == 0)
            {
                throw new Exception("Items not found");
            }
            return items;
        }
    }
}
