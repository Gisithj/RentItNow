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
using RentItNow.DTOs;
using RentItNow.DTOs.Customer;
using RentItNow.DTOs.Item;
using RentItNow.Models;
using RentItNow.Services;

namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRentalItemService _rentalItemService;
        private readonly IItemService _itemService;
        public ItemsController(IUnitOfWork unitOfWork, IMapper mapper, IRentalItemService rentalItemService, IItemService itemService)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _rentalItemService = rentalItemService;
            _itemService = itemService;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetItemDto>>> GetItems()
        {
            try
            {
                var items = await _unitOfWork.Item.GetAllAsync();


                if (items==null || items.Count() == 0)
                {
                    return NotFound("Renters not found");
                }

                List<GetItemDto> itemsDtoList = new List<GetItemDto>();

                foreach (Item item in items)
                {
                    var itemsDto = _mapper.Map<GetItemDto>(item);
                    itemsDtoList.Add(itemsDto);

                }
                return itemsDtoList;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpGet("WithInclude/{id}")]
        public async Task<ActionResult<ItemDto>> GetItemByIdWithInclude(Guid id)
        {
            try
            {
                var item = await _itemService.GetItemByIdWithInclude(id);
                var itemDto = _mapper.Map<ItemDto>(item);
                return itemDto;

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        [HttpGet("GetAllAvailableItemsByDateRange")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetAllAvailableItemsByDateRangeWithInclude(int pageNumber, int pageSize, DateTimeOffset rentalStartDate,DateTimeOffset rentalEndDate)
        {
            try
            {
                var allitems = await _itemService.GetAllAvailableItemsByDateRangeWithInclude(rentalStartDate, rentalEndDate, pageNumber, pageSize);
                var itemDtos = _mapper.Map<IEnumerable<ItemDto>>(allitems).ToList();


                return itemDtos;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpGet("WithInclude")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsWithInclude()
        {
            try
            {
                var allitems = await _itemService.GetAllItemsWithInclude();
                var itemDtos = _mapper.Map<IEnumerable<ItemDto>>(allitems).ToList();

               
                return itemDtos;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpGet("GetWithOffsetPagination")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetWithOffsetPagination(int pageNumber,int pageSize)
        {
            try
            {
                var items = await _itemService.GetAllItemsWithIncludePagedAsync(pageNumber, pageSize);
                var itemDtos = _mapper.Map<IEnumerable<ItemDto>>(items).ToList();
                return itemDtos;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpGet("ItemsByRenter/{renterId}")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsByRenterWithInclude(Guid renterId)
        {
            try
            {
                var allitems = await _itemService.GetAllItemsByRenterWithInclude(renterId);
                var itemDtos = _mapper.Map<IEnumerable<ItemDto>>(allitems).ToList();
                return itemDtos;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpGet("RentedItemsByRenter/{renterId}")]
        public async Task<ActionResult<IEnumerable<RentItemDto>>> GetRentedItemsByRenterWithInclude(Guid renterId)
        {
            try
            {
                //var allitems = await _itemService.GetAllRentedItemsByRenterWithInclude(renterId);
                var allItems = await _rentalItemService.GetAllRentedItemsByRenterWithIncludeAsync(renterId);
                var itemDtos = _mapper.Map<IEnumerable<RentItemDto>>(allItems).ToList();
                return itemDtos;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }
        // GET: api/Items/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetItemDto>> GetItemById(Guid id)
        {
            try
            {
                var item = await _unitOfWork.Item.GetByIdAsync(id);
                var itemDto = _mapper.Map<GetItemDto>(item);
                return itemDto;

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // PUT: api/Items/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutItem(UpdateItemDto updateItemDto)
        {
            try
            {
                
                //var updatedItem = _mapper.Map<Item>(updateItemDto);
                await _itemService.UpdateItem(updateItemDto);
                return Ok(updateItemDto);

            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        
        }

        // POST: api/Items
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CreateItemDto>> PostItem(CreateItemDto createItemDto)
        {
     
            try
            {
                var item = _mapper.Map<Item>(createItemDto);
                await _itemService.CreateItem(item);
                return createItemDto;

            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        // DELETE: api/Items/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {    
            try
            {
                _rentalItemService.DeleteRentalItemsBytItemId(id);
                await _itemService.DeleteItem(id);
                return Ok("Item deleted");
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpPost("RentItem")]
        public async Task<ActionResult<RentItemDto>> RentItem(RentItemDto rentItemDto)
        {
            try
            {
                RentalItem rentalItem = _mapper.Map<RentItemDto, RentalItem>(rentItemDto);
                await _rentalItemService.RentItemAsync(rentalItem);
                return rentItemDto;
       

            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpGet("IsItemAvailable")]
        public async Task<ActionResult<bool>> IsItemAvailable(Guid itemID, DateTimeOffset rentalStartDate, DateTimeOffset rentalEndDate)
        {
            try
            {
                var isAvailable = await _rentalItemService.IsAvailableForRent(itemID,rentalStartDate, rentalEndDate);
                
                return isAvailable;

            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        [HttpPost("EndRentItem")]
        public async Task<ActionResult<EndRentDto>> EndRent(EndRentDto endRentDto)
        {
            try
            {

                await _rentalItemService.EndRentItemAsync(endRentDto.ItemId,endRentDto.RentalItemId);
                return endRentDto;


            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }


    }
}
