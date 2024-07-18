using Microsoft.Extensions.Logging;
using RentItNow.configurations;
using RentItNow.Enums;
using RentItNow.Services;
using System.Reflection.Metadata;

namespace RentItNow.BackgroundServices
{
    public class RentalStartEndService:BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RentalStartEndService> _logger;
        public RentalStartEndService(IServiceProvider serviceProvider, ILogger<RentalStartEndService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("RentalStartEndService is starting.");
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("RentalStartEndService is running at: {time}", DateTimeOffset.Now);
                using (var scope = _serviceProvider.CreateScope())
                {
                    var now = DateTimeOffset.UtcNow;

                    // Update rental statuses
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var rentalItemScope = scope.ServiceProvider.GetRequiredService<IRentalItemService>();
                    var rentalItems = await rentalItemScope.GetAllRentalItems();
                    bool hasUpdates = false;
                    if (rentalItems != null)
                    {
                        foreach (var rentalItem in rentalItems)
                        {
                            var targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

                            var rentalStartDate = TimeZoneInfo.ConvertTimeFromUtc(rentalItem.RentalStartDate.UtcDateTime, targetTimeZone);
                            var rentalEndDate = TimeZoneInfo.ConvertTimeFromUtc(rentalItem.RentalEndDate.UtcDateTime, targetTimeZone);

                            _logger.LogInformation("RentalStartEndService item time : {time}", rentalItem.RentalStartDate.UtcDateTime);
                            _logger.LogInformation("RentalStartEndService item converted time : {time}", TimeZoneInfo.ConvertTimeFromUtc(rentalItem.RentalStartDate.UtcDateTime,targetTimeZone));
                            _logger.LogInformation("RentalStartEndService item status : {status}", rentalItem.rentalStatus);
                            _logger.LogInformation("RentalStartEndService item status condition : {condition1}", rentalStartDate <= now && rentalEndDate >= now);
                            _logger.LogInformation("RentalStartEndService item status condition : {condition2}", rentalEndDate < now);
                            _logger.LogInformation("RentalStartEndService item status condition : {condition3}", rentalStartDate > now);

                            if (rentalItem.rentalStatus == RentalStatus.Reserved && rentalStartDate <= now && rentalEndDate >= now)
                            {
                                rentalItem.rentalStatus = RentalStatus.Rented;
                                hasUpdates = true;
                                _logger.LogInformation("RentalStartEndService item reseved and changed to rented 1");
                            }
                            else if (rentalItem.rentalStatus == RentalStatus.Reserved && rentalStartDate <= now)
                            {
                                rentalItem.rentalStatus = RentalStatus.Rented;
                                hasUpdates = true;
                                _logger.LogInformation("RentalStartEndService item Reserved and changed to Rented 2 ");
                            }
                            else if (rentalItem.rentalStatus == RentalStatus.Rented && rentalEndDate < now)
                            {
                                rentalItem.rentalStatus = RentalStatus.Available;
                                rentalItem.isRentOver = true;
                                hasUpdates = true;
                                _logger.LogInformation("RentalStartEndService item rented and changed to Available ");
                            }
                            else if (rentalItem.rentalStatus == RentalStatus.Available && rentalStartDate > now)
                            {
                                rentalItem.rentalStatus = RentalStatus.Reserved;
                                hasUpdates = true;
                                _logger.LogInformation("RentalStartEndService item rented and Available to Reserved ");
                            }
                        }
                    }
                    

                    if (hasUpdates)
                    {

                        await rentalItemScope.UpdateRentalItem(rentalItems);
                        _logger.LogInformation("RentalStartEndService item updated ");

                    }
                }
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Check every minute
            }
        }

    }
}
