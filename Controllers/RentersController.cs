using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentItNow.Core.Services;
using RentItNow.Data;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.Models;

namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentersController : ControllerBase
    {
        private readonly IRenterService _renterService;
        private readonly IMapper _mapper;
        public RentersController(RentItNowDbContext context,IRenterService renterService,IMapper mapper)
        {
            _renterService = renterService;
            _mapper = mapper;
        }

        // GET: api/Renters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRenterDto>>> GetRenters()
        {
            try
            {
                var renters = await _renterService.GetRenters();

                if (renters.Count == 0)
                {
                    return NotFound("Renters not found");
                }

                List<GetRenterDto> rentersDtoList = new List<GetRenterDto>();

                foreach (Renter renter in renters)
                {
                    var rentersDto = _mapper.Map<GetRenterDto>(renters);
                    rentersDtoList.Add(rentersDto);
                    
                }
                return rentersDtoList;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        // GET: api/Renters/GetRenterByUsername/username
        [HttpGet("GetRenterByUsername")]
        public async Task<ActionResult<GetRenterDto>> GetRenterByUsername(string username)
        {
            if(username == null)
            {
                return BadRequest("Enter a username");
            }

            try
            {
                var renter = await _renterService.GetRenterByUsername(username);
                var renterDto = _mapper.Map<GetRenterDto>(renter);
                return renterDto;
                
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
                
            }
        }

        // GET: api/Renters/GenRenterById/5
        [HttpGet("GenRenterById")]
        public async Task<ActionResult<GetRenterDto>> GetRenterById(int id)
        {
            try
            {
                var renter = await _renterService.GetRenterById(id);
                var renterDto = _mapper.Map<GetRenterDto>(renter);
                return renterDto;

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // PUT: api/Renters/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRenter(int id, Renter renter)
        {
            if (renter == null || id != renter.RenterId)
            {
                return BadRequest();
            }

            var updatedRenter = await _renterService.UpdateRenter(id, renter);
            if (updatedRenter == null)
            {
                return NoContent();
            }

            return Ok(updatedRenter);
        }

        // POST: api/Renters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Renter>> PostRenter(CreateRenterDto renterDto)
        {
            if(renterDto == null)
            {
              return BadRequest();
            }

            try
            {
                var renter = _mapper.Map<Renter>(renterDto);
                var renterCreated = await _renterService.CreateRenter(renter);
                return renterCreated;
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        // DELETE: api/Renters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRenter(int id)
        {
            try
            {
                await _renterService.DeleteRenter(id);
                return Ok("renter deleted");
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        
    }
}
