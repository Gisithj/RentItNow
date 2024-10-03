using AutoMapper;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using RentItNow.DTOs.Chat;
using RentItNow.DTOs.Customer;
using RentItNow.DTOs.Message;
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
        private readonly IChatService _chatService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        public MessageController(
                IHubContext<RentalRequestHub, 
                IMessageClient> messageHub, 
                IMessageService messageService, 
                INotificationService notificationService, 
                IChatService chatService,
                IMapper mapper)
        {
            _messageHub = messageHub;
            _messageService = messageService;
            _notificationService = notificationService;
            _chatService = chatService;
            _mapper = mapper;
        }

        [HttpPost("CreateChat")]
        public async Task<ActionResult<ChatDto>> CreateChatAsync(CreateChatDto chatDto)
        {
            try
            {
                var chat = _mapper.Map<Chat>(chatDto);
                var chatResult = await _chatService.CreateChat(chat);
                return _mapper.Map<ChatDto>(chatResult);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpGet("GetAllChatsByUserId")]
        public async Task<ActionResult<IEnumerable<ChatDto>>> GetAllChatsByUserIdAsync(string userId)
        {
            try
            {
                var chats = await _chatService.GetAllChatsByUserId(userId);
                return _mapper.ProjectTo<ChatDto>(chats.AsQueryable()).ToList();
            }
            catch (Exception e)
            {

                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
        [HttpGet("GetPreviousChatMessage")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetPreviousChatMessagesAsync(Guid chatId)
        {
            try
            {
                var messages = await _messageService.GetAllChatMessagesByChatId(chatId);
                var messagesDtos = _mapper.ProjectTo<MessageDto>(messages.AsQueryable()).ToList();
                return messagesDtos.ToList();
            }
            catch (Exception e)
            {

                return StatusCode(500, $"Internal server error: {e.Message}");
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
            catch (Exception e)
            {

                return StatusCode(500, $"Internal server error: {e.Message}");
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
            catch (Exception e)
            {

                return StatusCode(500, $"Internal server error: {e.Message}");
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
            catch (Exception e)
            {

                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
    }
}