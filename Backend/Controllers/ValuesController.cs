using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RentItNow.websocket;

namespace SignalRDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOfferController : ControllerBase
    {
        private IHubContext<RentalRequestHub, IMessageClient> messageHub;
        public ProductOfferController(IHubContext<RentalRequestHub, IMessageClient> _messageHub)
        {
            messageHub = _messageHub;
        }
        [HttpPost]
        [Route("productoffers")]
        public async Task<string> GetAsync(Guid customerid,Guid itemId)
        {
            //messageHub.Clients.All.SendOffersToUser(offer);
            await messageHub.Clients.All.SendRentalRequestToRenter(itemId, customerid);
            return "Offers sent successfully to all users!";
        }
    }
}