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
using RentItNow.DTOs.Item;
using RentItNow.Models;

namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public ItemsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetItemDto>>> GetItems()
        {
            try
            {
                var items = await _unitOfWork.Item.GetAllAsync();


                if (items.Count() == 0)
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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(Guid id, UpdateItemDto updateItemDto)
        {
            if (updateItemDto == null)
            {
                return BadRequest();
            }
            var existingItem = await _unitOfWork.Item.GetByIdAsync(id);
            if (existingItem == null)
            {
                return BadRequest();
            }
            Item item = _mapper.Map(updateItemDto, existingItem);

            var updatedItem = await _unitOfWork.Item.UpdateAsync(item);

            await _unitOfWork.CompleteAsync();
            return Ok(updatedItem);
        }

        // POST: api/Items
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(CreateItemDto createItemDto)
        {
            try
            {

                var item = _mapper.Map<Item>(createItemDto);
                var itemCreated = await _unitOfWork.Item.AddAsync(item);
                await _unitOfWork.CompleteAsync();
                return CreatedAtAction("GetItemById", new { item.ItemId }, item);

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
                await _unitOfWork.Item.DeleteAsync(id);
                await _unitOfWork.CompleteAsync();
                return Ok("Item deleted");
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }


    }
}
