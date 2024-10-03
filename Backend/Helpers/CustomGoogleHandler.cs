
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;



    public class CustomGoogleHandler : GoogleHandler
    {
        public CustomGoogleHandler(IOptionsMonitor<GoogleOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<HandleRequestResult> HandleRemoteAuthenticateAsync()
        {
            var result = base.HandleRemoteAuthenticateAsync().Result;

            // If the error is due to state validation, ignore it
            if (!result.Succeeded && result.Failure?.Message.Contains("oauth state") == true)
            {
                var ticket = new AuthenticationTicket(result.Principal, result.Properties, Scheme.Name);
                return Task.FromResult(HandleRequestResult.Success(ticket));
            }

            return Task.FromResult(result);
        }
    }

