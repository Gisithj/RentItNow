using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using RentItNow.DTOs.Customer;
using RentItNow.DTOs.Notification;
using RentItNow.Models;
using RentItNow.Services;
using RentItNow.websocket;
using System.Threading.Tasks;

namespace SignalRDemo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private IHubContext<RentalRequestHub, IMessageClient> _messageHub;
        private readonly IMessageService _messageService;
        private readonly INotificationService _notificationService;
        public MessageController(IHubContext<RentalRequestHub, IMessageClient> messageHub, IMessageService messageService, INotificationService notificationService)
        {
            _messageHub = messageHub;
            _messageService = messageService;
            _notificationService = notificationService;
        }
        [HttpPost]
        [Route("productoffers")]
        public async Task<string> GetAsync(Guid customerid,Guid itemId)
        {
            //messageHub.Clients.All.SendOffersToUser(offer);
            //await messageHub.Clients.All.SendRentalRequestToRenter(itemId, customerid);
            return "Offers sent successfully to all users!";
        }
        [HttpGet("GetPreviousChatMessage")]
        public async Task<ActionResult<IEnumerable<Messages>>> GetPreviousChatMessagesAsync(string senderId, string receiverID)
        {
            try
            {
                var messages = await _messageService.GetAllChatMessagesBytIds(senderId, receiverID);
                return messages.ToList();
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet("GetNotifications")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotificationsAsync(string userId)
        {
            try
            {
                var messages = await _notificationService.GetAllNotificationsByUserId(userId);
                return messages.ToList();
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost("MarkNotificationAsRead")]
        public async Task<ActionResult> MarkNotificationAsRead(string id, string connectionId)
        {
            try
            {
                await _notificationService.MarkNotificationAsRead(Guid.Parse(id));
                await _messageHub.Clients.Client(connectionId).NotificationUpdate();
                return Ok("Notification marked as read.");
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost("MarkAllNotificationsAsRead")]
        public async Task<ActionResult> MarkAllNotificationsAsRead(MarkAllNotificationReadDto MarkAllNotificationReadDto)
        {
            try
            {
                if (MarkAllNotificationReadDto.ConnectionId.IsNullOrEmpty() || MarkAllNotificationReadDto.ConnectionId.IsNullOrEmpty())
                {
                    return BadRequest("userId and connectionId are required.");
                }
                await _notificationService.MarkAllNotificationAsRead(MarkAllNotificationReadDto.UserId);
                await _messageHub.Clients.Client(MarkAllNotificationReadDto.ConnectionId).NotificationUpdate();
                return Ok("All notifications marked as read.");
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}