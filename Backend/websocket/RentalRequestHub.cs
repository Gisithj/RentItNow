using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RentItNow.Services;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;

namespace RentItNow.websocket
{
    
    public class RentalRequestHub:Hub<IMessageClient>
    {
        private readonly IItemService _itemService;

        public RentalRequestHub(IItemService itemService)
        {
            _itemService = itemService;
        }
        public async Task SendOffersToUser(string message)
        {
            await Clients.All.SendOffersToUser(message);
        }

        private static readonly ConcurrentDictionary<Guid, string> RenterConnections = new ConcurrentDictionary<Guid, string>();
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
                   if(claim.Type == "renterId")
                    {
                        RenterConnections.TryAdd(Guid.Parse(claim.Value), Context.ConnectionId);
                    }
                    else if(claim.Type == "customerId")
                    {
                        CustomerConnections.TryAdd(Guid.Parse(claim.Value), Context.ConnectionId);
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
            var renterIdClaim = jwtToken.Claims.First(claim => claim.Type == "renterId");

            // Parse the renterId from the claim
            var renterId = Guid.Parse(renterIdClaim.Value);

            // Remove the mapping when the connection is closed
            RenterConnections.TryRemove(renterId, out _);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendRentalRequestToRenter(Guid itemId, Guid customerId)
        {
            // Query the database to find the Item
            var item = await _itemService.GetItemById(itemId);

            if (item != null)
            {
                // Get the RenterId from the Item
                var renterId = item.RenterId;
                var rentc = RenterConnections;
                Boolean rentCId = RenterConnections.TryGetValue(renterId, out var a);
                if (RenterConnections.TryGetValue(renterId, out var connectionId))
                {
                    // Create a message to send to the Renter
                    var message = $"Customer {customerId} has requested to rent your item {itemId}";

                    // Send the message to the specific Renter
                    await Clients.Client(connectionId).SendOffersToUser(message);
                }
            }
        }

    }
}
