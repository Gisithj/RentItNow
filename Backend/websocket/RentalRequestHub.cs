using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;
using RentItNow.DTOs.Message;
using RentItNow.Enums;
using RentItNow.Models;
using RentItNow.Services;
using System;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RentItNow.websocket
{
    
    public class RentalRequestHub:Hub<IMessageClient>
    {
        private readonly IMapper _mapper;
        private readonly IMessageService _messageService;
        private readonly INotificationService _notificationService;
        private readonly IChatService _chatService;
        private readonly UserManager<User> _userManager;


        public RentalRequestHub(
            IMessageService messageService, 
            IMapper mapper, 
            UserManager<User> userManager, 
            INotificationService notificationService,
            IChatService chatService)
        {
            _messageService = messageService;
            _userManager = userManager;
            _notificationService = notificationService;
            _chatService = chatService;
            _mapper = mapper;
        }
        public async Task SendOffersToUser(string message)
        {
            //await Clients.All.SendOffersToUser(message);
        }

        private static readonly ConcurrentDictionary<Guid, string> connections = new ConcurrentDictionary<Guid, string>();
        private static readonly ConcurrentDictionary<Guid, string> CustomerConnections = new ConcurrentDictionary<Guid, string>();

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            // Read the token from the cookie
            var token = httpContext!.Request.Cookies["token"];

            // Validate the token and extract the claims
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            if (jwtToken != null)
            {
                jwtToken.Claims.ToList().ForEach(claim =>
                {
                   if(claim.Type == ClaimTypes.NameIdentifier)
                    {
                        connections.TryAdd(Guid.Parse(claim.Value), Context.ConnectionId);
                    }
                });
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();

            // Read the token from the cookie
            var token = httpContext!.Request.Cookies["token"];

            // Validate the token and extract the claims
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userIdClaim = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier);

            // Parse the renterId from the claim
            var userId = Guid.Parse(userIdClaim.Value);

            // Remove the mapping when the connection is closed
            connections.TryRemove(userId, out _);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPrivateMessage(MessageDto messageDto)
        {
            try
            {
                var message = _mapper.Map<MessageDto, Messages>(messageDto);

                // Get the sender and receiver
                var sender = await _userManager.FindByIdAsync(messageDto.SenderId);
                var receiver = await _userManager.FindByIdAsync(messageDto.ReceiverId);
                // Save the message to the database
                Chat chat = await _chatService.GetChatBySenderAndReceiverId(messageDto.SenderId, messageDto.ReceiverId);
                if(chat == null)
                {
                    var newChat = new Chat()
                    {
                        SenderId = messageDto.SenderId,
                        ReceiverId = messageDto.ReceiverId,
                        Timestamp = DateTime.UtcNow,
                        Sender = sender,
                        Receiver = receiver,
                    };
                    chat = await _chatService.CreateChat(newChat);
                }
                else
                {

                }

                message.Timestamp = DateTime.UtcNow;
                message.ChatId = chat.Id;
                await _messageService.AddMessage(message);
                var returnMessageDto = _mapper.Map<Messages, MessageDto>(message);
                // Determine the recipient's connection ID
                string connectionId;
                if (connections.TryGetValue(Guid.Parse(messageDto.ReceiverId), out connectionId))
                {

                    // Send the message to the specific recipient
                    await Clients.Client(connectionId).NewMessage(returnMessageDto);
                    await Clients.Caller.NewMessage(returnMessageDto);

                }
                else
                {
                    Notification newNotification = new Notification()
                    {
                        UserId = messageDto.ReceiverId,
                        SenderId = messageDto.SenderId,
                        Message = "You have a new message from " + sender.UserName,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _chatService.UpdateUnreadCount(chat.Id,1);
                    var notification = await _notificationService.AddNotification(newNotification);                    
                    await Clients.Caller.NewMessage(returnMessageDto);

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        public async Task MessageRead(string receiverId, string senderId) { 
            try
            {
                var messages = await _messageService.MarkAllUnreadMessagesById(senderId, receiverId);
                Chat chat = await _chatService.GetChatBySenderAndReceiverId(senderId,receiverId);
                if(chat != null)
                {
                    await _chatService.UpdateUnreadCount(chat.Id);
                }
                string connectionId;
                if (connections.TryGetValue(Guid.Parse(senderId), out connectionId))
                {

                    // Send the message to the specific recipient
                    var returnMessagesDto = _mapper.ProjectTo<MessageDto>(messages.AsQueryable());
                    await Clients.Client(connectionId).MessageStatusUpdate(returnMessagesDto);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        public async Task MarkNotificationAsRead(Guid messageId)
        {
            try
            {
                await _notificationService.MarkNotificationAsRead(messageId);
            }
            catch (Exception)
            {

                throw;
            }
        }



    }
}
