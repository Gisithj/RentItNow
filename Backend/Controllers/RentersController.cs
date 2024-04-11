using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RentItNow.configurations;
using RentItNow.DTOs.Rent;
using RentItNow.DTOs.Renter;
using RentItNow.DTOs.User;
using RentItNow.Helpers;
using RentItNow.Models;
namespace RentItNow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtTokenHelper _jwtHelper;
        public RentersController(IMapper mapper, IUnitOfWork unitOfWork, JwtTokenHelper jwtHelper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _jwtHelper = jwtHelper;
        }

        // GET: api/Renters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRenterDto>>> GetRenters()
        {
            try
            {
                var renters = await _unitOfWork.Renter.GetAllAsync();


                if (renters==null || renters.Count() == 0)
                {
                    return NotFound("Renters not found");
                }

                List<GetRenterDto> rentersDtoList = new List<GetRenterDto>();
                
                foreach (Renter renter in renters)
                {
                    var rentersDto = _mapper.Map<GetRenterDto>(renter);
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
                var renter = await _unitOfWork.Renter.GetRenterByUsernameAsync(username);
                var renterDto = _mapper.Map<GetRenterDto>(renter);
                return renterDto;
                
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
                
            }
        }

        // GET: api/Renters/GenRenterById/5
        [HttpGet("GetRenterById/{id}")]
        public async Task<ActionResult<GetRenterDto>> GetRenterById(Guid id)
        {
            try
            {
                var renter = await _unitOfWork.Renter.GetByIdAsync(id);
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
        public async Task<IActionResult> PutRenter(Guid id, UpdateRenterDto updateRenter)
        {
            if (updateRenter == null)
            {
                return BadRequest();
            }
            var existingRenter = await _unitOfWork.Renter.GetByIdAsync(id);
            if (existingRenter == null)
            {
                return BadRequest();
            }
            Renter renter = _mapper.Map(updateRenter,existingRenter);

            var updatedRenter = await _unitOfWork.Renter.UpdateAsync(renter);
            if (updatedRenter == null)
            {
                return NoContent();
            }
            await _unitOfWork.CompleteAsync();
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
                var user = _mapper.Map<User>(renterDto);
                var userCreated = await _unitOfWork.User.CreateUserAsync(user,renterDto.Password);
                if(userCreated.Succeeded) {
                    var renter = _mapper.Map<Renter>(renterDto);
                    renter.User = user;
                    var renterCreated = await _unitOfWork.Renter.AddAsync(renter);
                    await _unitOfWork.CompleteAsync();
                    var tokenHandler = _jwtHelper.GenerateJwtToken(renterCreated.RenterId.ToString(), user.Email, 30,"renter");

                    return Ok(tokenHandler);
                    //return CreatedAtAction("GetRenterById", new { renter.RenterId }, renter);
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

        // DELETE: api/Renters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRenter(Guid id)
        {
            try
            {
                await _unitOfWork.Renter.DeleteAsync(id);
                await _unitOfWork.CompleteAsync();
                return Ok("renter deleted");
            }
            catch (Exception ex)
            {

                return NotFound(ex.Message);
            }
        }

        
    }
}
