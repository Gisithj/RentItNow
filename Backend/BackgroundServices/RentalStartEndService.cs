using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NuGet.Protocol.Plugins;
using RentItNow.configurations;
using RentItNow.DTOs.Message;
using RentItNow.Enums;
using RentItNow.Models;
using RentItNow.Services;
using RentItNow.Services.Impl;
using RentItNow.websocket;
using System.Reflection.Metadata;

namespace RentItNow.BackgroundServices
{
    public class RentalStartEndService:BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RentalStartEndService> _logger;
        private IHubContext<RentalRequestHub, IMessageClient> _messageHub;
        private int _notificationCount;
        private DateTime _lastNotificationDate;
        private DateTimeOffset _lastNotificationTime;
        private DateTimeOffset _lastOverdueUpdate;
        private readonly TimeSpan _notificationInterval = TimeSpan.FromHours(4);

        Dictionary<Guid, int> overdueCounts = new Dictionary<Guid, int>();
        private bool _initialRunCompleted = false;
        private List<RenterConfig> renterConfig = new List<RenterConfig>(); 

        public RentalStartEndService(
            IServiceProvider serviceProvider,
            ILogger<RentalStartEndService> logger, 
            IHubContext<RentalRequestHub,IMessageClient> messageHub
   )
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _messageHub = messageHub;
            _notificationCount = 0;
            _lastNotificationDate = DateTime.UtcNow.Date;
            _lastOverdueUpdate = DateTime.UtcNow;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("RentalStartEndService is starting.");
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("RentalStartEndService is running at: {time}", DateTimeOffset.Now);
                using (var scope = _serviceProvider.CreateScope())
                {
                    
                    if (!_initialRunCompleted)
                    {
                        // Update intial overdue days
                        renterConfig = (await scope.ServiceProvider.GetRequiredService<IRenterConfigService>().GetConfiguration()).ToList();
                        await UpdateOverDueDays();
                        _initialRunCompleted = true;
                    }
                    
                    var now = DateTimeOffset.UtcNow;
                    if (_lastNotificationDate < now.Date)
                    {
                        _notificationCount = 0;
                        _lastNotificationDate = now.Date;
                        _lastNotificationTime = now.Date;
                    }
                    await RentalStatusUpdate();

                    // Send notifications
                    foreach (KeyValuePair<Guid, int> count in overdueCounts)
                    {
                        if (count.Value > 0)
                        {
                            if (_notificationCount < 6 && (now - _lastNotificationTime) >= TimeSpan.FromHours(24))

                            //    if (_notificationCount < 6 && (now - _lastNotificationTime) >= TimeSpan.FromHours(renterConfig.First(rc => rc.RenterId == count.Key).overdueNotificationIntervalInHours))
                            {
                                var message = count.Value == 1
                               ? "You have one overdue rental."
                               : $"You have {count.Value} overdue rental items. Please return them as soon as possible.";


                                await SendNotificationAsync(count.Key,message);
                                _notificationCount++;
                                _lastNotificationTime = now;
                            }
                        }
                    }
                   
                }
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Check every minute
            }
        }
        private async Task RentalStatusUpdate()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var now = DateTimeOffset.UtcNow;
                var rentalItemScope = scope.ServiceProvider.GetRequiredService<IRentalItemService>();
                var rentalItems = await rentalItemScope.GetAllRentalItems();
                bool hasUpdates = false;
                int overdueCount = 0;

                if (rentalItems != null)
                {
                    foreach (var rentalItem in rentalItems)
                    {
                        var targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                        var rentalStartDate = TimeZoneInfo.ConvertTimeFromUtc(rentalItem.RentalStartDate.UtcDateTime, targetTimeZone);
                        var rentalEndDate = TimeZoneInfo.ConvertTimeFromUtc(rentalItem.RentalEndDate.UtcDateTime, targetTimeZone);

                        if (rentalItem.RentalStatus == RentalStatus.Reserved && rentalStartDate <= now && rentalEndDate >= now)
                        {
                            rentalItem.RentalStatus = RentalStatus.Rented;
                            hasUpdates = true;
                            _logger.LogInformation("RentalStartEndService item reseved and changed to rented 1");
                        }
                        else if (rentalItem.RentalStatus == RentalStatus.Reserved && rentalStartDate <= now)
                        {
                            rentalItem.RentalStatus = RentalStatus.Rented;
                            hasUpdates = true;
                            _logger.LogInformation("RentalStartEndService item Reserved and changed to Rented 2 ");
                        }
                        else if (rentalItem.RentalStatus == RentalStatus.Rented && rentalEndDate < now)
                        {
                            rentalItem.RentalStatus = RentalStatus.Overdue;
                            hasUpdates = true;
                            _logger.LogInformation("RentalStartEndService item rented and changed to Overdue ");
                        }
                        else if (rentalItem.RentalStatus == RentalStatus.Available && rentalStartDate > now)
                        {
                            rentalItem.RentalStatus = RentalStatus.Reserved;
                            hasUpdates = true;
                            _logger.LogInformation("RentalStartEndService item rented and Available to Reserved ");
                        }
                        else if (rentalItem.RentalStatus == RentalStatus.Overdue)
                        {

                            // Update overdue days count if 24 hours have passed
                            if ((now - _lastOverdueUpdate).TotalHours >= 24 || now == _lastOverdueUpdate)
                            {
                                _logger.LogInformation("overdue update called");
                                await UpdateOverDueDays();
                                _lastOverdueUpdate = now;
                            }
                            else
                            {
                                _logger.LogInformation("No 24 hours");
                            }

                            // update overdue item count
                            overdueCount++;
                            if (overdueCounts.ContainsKey(rentalItem.CustomerId))
                            {
                                overdueCounts[rentalItem.CustomerId]++;
                            }
                            else
                            {
                                overdueCounts[rentalItem.CustomerId] = 1;
                            }
                        }
                    }
                }


                if (hasUpdates)
                {
                    await rentalItemScope.UpdateRentalItem(rentalItems);
                    _logger.LogInformation("RentalStartEndService item updated ");

                }
            }
        }
        private async Task UpdateOverDueDays()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var rentalItemScope = scope.ServiceProvider.GetRequiredService<IRentalItemService>();

                var rentalItems = await rentalItemScope.GetAllRentalItems();
                bool hasUpdates = false;

                if (rentalItems != null)
                {
                    foreach (var rentalItem in rentalItems)
                    {
                        if (rentalItem.RentalStatus == RentalStatus.Overdue)
                        {
                            var targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                            var rentalEndDate = TimeZoneInfo.ConvertTimeFromUtc(rentalItem.RentalEndDate.UtcDateTime, targetTimeZone);
                            rentalItem.overdueDays = (int)(DateTime.Now - rentalEndDate).TotalDays;
                            hasUpdates = true;
                        }
                    }
                }

                if (hasUpdates && rentalItems != null)
                {
                    await rentalItemScope.UpdateRentalItem(rentalItems);
                    _logger.LogInformation("RentalStartEndService item updated ");

                }
            }
        }
        private async Task SendNotificationAsync(Guid customerId, string message)
        {
            _logger.LogInformation("Sending notification to customer {customerId} with message {message}", customerId, message);
            using (var scope = _serviceProvider.CreateScope())
            {
                var customerServiceScope = scope.ServiceProvider.GetRequiredService<ICustomerService>();
                var notificationServiceScope = scope.ServiceProvider.GetRequiredService<INotificationService>();

                var customer = await customerServiceScope.GetCustomerById(customerId);
                var connectionId = RentalRequestHub.GetConnectionId(customer.UserId);
                if (connectionId != null)
                {
                    await _messageHub.Clients.Client(connectionId).RentalStatusNotification(message);
                }
                else
                {
                    Notification newNotification = new Notification()
                    {
                        UserId = customer.UserId,
                        Message = message,
                        CreatedAt = DateTime.UtcNow
                    };
                    await notificationServiceScope.AddNotification(newNotification);
                    // Handle the case where the user is not connected
                    _logger.LogInformation($"User {customer.UserId} is not connected. Notification not sent.");
                }
            }
             
        }

    }
}
