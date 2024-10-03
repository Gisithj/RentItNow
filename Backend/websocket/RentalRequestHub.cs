using AutoMapper;
using AutoMapper.Execution;
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
using System.Reflection;
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

        private static readonly ConcurrentDictionary<string, string> connections = new ConcurrentDictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            var token = httpContext?.Request.Cookies["token"];

            if (string.IsNullOrEmpty(token))
            {
                Context.Abort();
                return;
            }

            // Validate the token and extract the claims
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            if (jwtToken != null)
            {
                jwtToken.Claims.ToList().ForEach(claim =>
                {
                   if(claim.Type == ClaimTypes.NameIdentifier)
                    {
                        connections.TryAdd(claim.Value, Context.ConnectionId);
                    }
                });
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();

            // Read the token from the cookie
            var token = httpContext.Request.Cookies["token"];
            if (!string.IsNullOrEmpty(token))
            {
                // Validate the token and extract the claims
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                var userIdClaim = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    var userId = userIdClaim.Value;
                    connections.TryRemove(userId, out _);
                }
            }

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

                message.Timestamp = DateTime.UtcNow;
                message.ChatId = chat.Id;
                await _messageService.AddMessage(message);
                await _chatService.UpdateUnreadCount(message.ChatId, 1);
                var returnMessageDto = _mapper.Map<Messages, MessageDto>(message);
                // Determine the recipient's connection ID
                string connectionId;
                if (connections.TryGetValue(messageDto.ReceiverId, out connectionId))
                {

                    // Send the message to the specific recipient
                    await Clients.Client(connectionId).NewMessage(returnMessageDto);


                }
                await Clients.Caller.NewMessage(returnMessageDto);

                //else
                //{
                //    Notification newNotification = new Notification()
                //    {
                //        UserId = messageDto.ReceiverId,
                //        SenderId = messageDto.SenderId,
                //        Message = "You have a new message from " + sender.UserName,
                //        CreatedAt = DateTime.UtcNow
                //    };
                //    var notification = await _notificationService.AddNotification(newNotification);                    
                //await Clients.Caller.NewMessage(returnMessageDto);

                //}
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
                
                string connectionId;
                if (connections.TryGetValue(senderId, out connectionId))
                {
                    if(connectionId != Context.ConnectionId)
                    {
                        Chat chat = await _chatService.GetChatBySenderAndReceiverId(senderId, receiverId);
                        if (chat != null)
                        {
                            await _chatService.UpdateUnreadCount(chat.Id);
                        }
                    }
                    // Send the message to the specific recipient
                    var returnMessagesDto = _mapper.ProjectTo<MessageDto>(messages.AsQueryable()).ToList();

                    await Clients.Client(connectionId).MessageStatusUpdate(returnMessagesDto.ToList());
                    await Clients.Caller.MessageStatusUpdate(returnMessagesDto.ToList());
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

        public static string? GetConnectionId(string userId)
        {
            connections.TryGetValue(userId, out var connectionId);
            return connectionId;
        }
    }
}
