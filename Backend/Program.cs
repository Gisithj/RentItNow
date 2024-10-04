using Azure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using RentItNow.BackgroundServices;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.Helpers;
using RentItNow.Models;
using RentItNow.Services;
using RentItNow.Services.Impl;
using RentItNow.websocket;
using System.Reflection.Emit;
using System.Security.Claims;
using System.Text;


internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var jwtKey = builder.Configuration["JwtSettings:Key"];
        // Convert JWT key to SymmetricSecurityKey
        var jwtSecKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
        var jwtAudience = builder.Configuration["JwtSettings:Audience"];
        var environment = builder.Configuration["ASPNETCORE_ENVIRONMENT"];
        var googleClientId = builder.Configuration["GoogleOAuth:GoogleClientId"];
        var googleClientSecret = builder.Configuration["GoogleOAuth:GoogleClientSecret"];
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();

        var keyVaultUri = builder.Configuration["KeyVault:Uri"];

        if (!string.IsNullOrEmpty(keyVaultUri))
        {
            builder.Configuration.AddAzureKeyVault(
                new Uri(keyVaultUri),
                new DefaultAzureCredential());
        }


        // AddAsync services to the container.
        builder.Services.AddDbContext<RentItNowDbContext>(
            options => options.UseSqlServer(connectionString)
       );
        builder.Services.AddCors(
        options =>
        {
            options.AddPolicy("AllowAnyOrigin",
               builder =>
               {
                   builder.WithOrigins(allowedOrigins)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
               });

        });

        builder.Services.AddHostedService<RentalStartEndService>();
        builder.Services.AddSwaggerGen();

        builder.Services.AddIdentityCore<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<RentItNowDbContext>()
            .AddSignInManager()
            .AddTokenProvider(TokenOptions.DefaultProvider, typeof(DataProtectorTokenProvider<User>))
            .AddTokenProvider(TokenOptions.DefaultEmailProvider, typeof(EmailTokenProvider<User>))
            .AddTokenProvider(TokenOptions.DefaultPhoneProvider, typeof(PhoneNumberTokenProvider<User>))
            .AddTokenProvider(TokenOptions.DefaultAuthenticatorProvider, typeof(AuthenticatorTokenProvider<User>));

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = jwtSecKey
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["token"];
                    return Task.CompletedTask;
                }
            };
        })
        //.AddCookie()
        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie("Identity.Application")
        .AddCookie(IdentityConstants.ExternalScheme)
        .AddGoogle(options =>
         {
             options.ClientId = googleClientId;
             options.ClientSecret = googleClientSecret;
             options.Scope.Add("profile");
             options.ClaimActions.MapJsonKey("picture", "picture", "url");
             options.SignInScheme = IdentityConstants.ExternalScheme;
         })

        ;
        builder.Services.Configure<CookiePolicyOptions>(options =>
        {
            // This lambda determines whether user consent for non-essential cookies is needed for a given request.
            options.CheckConsentNeeded = context => true;
            options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
        });
        builder.Services.AddAuthorization();


        builder.Services.AddControllers();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // Register SignalR
        builder.Services.AddSignalR();

        // Register Identity Services
        builder.Services.AddScoped<UserManager<User>>();
        builder.Services.AddScoped<SignInManager<User>>();
        builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, UserClaimsPrincipalFactory<User, IdentityRole>>();

        // Register Application Services
        builder.Services.AddScoped<IChatService, ChatService>();
        builder.Services.AddScoped<INotificationService, NotificationService>();
        builder.Services.AddScoped<IMessageService, MessageService>();
        builder.Services.AddScoped<IRentalItemService,RentalItemService>();
        builder.Services.AddScoped<IItemService, ItemService>();
        builder.Services.AddScoped<ICustomerService, CustomerService>();
        builder.Services.AddScoped<IRenterConfigService, RenterConfigService>();

        builder.Services.AddScoped<IRenterService, RenterService>();
        // Register Unit of Work
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register Helpers
        builder.Services.AddScoped<JwtTokenHelper>();
        builder.Services.AddScoped<RolesHelper>();

        var app = builder.Build();

        // Apply migrations automatically
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<RentItNowDbContext>();
            context.Database.Migrate();
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseForwardedHeaders();
            app.UseSwagger();
            app.UseSwaggerUI();

        }
        else
        {
            app.UseForwardedHeaders();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowAnyOrigin");
        app.MapHub<RentalRequestHub>("/chat");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
