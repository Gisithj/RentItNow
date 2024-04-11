namespace RentItNow.websocket
{
    public interface IMessageClient
    {
        Task SendOffersToUser(string message);
        Task SendRentalRequestToRenter(Guid itemId, Guid customerId);
    }
}
