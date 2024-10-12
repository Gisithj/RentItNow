using Azure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentItNow.BackgroundServices;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.Helpers;
using RentItNow.Models;
using RentItNow.Services;
using RentItNow.Services.Impl;
using RentItNow.websocket;
using System.Text;


internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.AddEnvironmentVariables();

        var keyVaultUri = builder.Configuration["KeyVault:Uri"];

        if (!string.IsNullOrEmpty(keyVaultUri))
        {
            builder.Configuration.AddAzureKeyVault(
                new Uri(keyVaultUri),
                new DefaultAzureCredential());
        }

        var jwtKey = builder.Configuration["JwtSettings:Key"];
        var jwtSecKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
        var jwtAudience = builder.Configuration["JwtSettings:Audience"];
        var environment = builder.Configuration["ASPNETCORE_ENVIRONMENT"];
        var googleClientId = builder.Configuration["GoogleOAuth:GoogleClientId"];
        var googleClientSecret = builder.Configuration["GoogleOAuth:GoogleClientSecret"];
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        Console.WriteLine($"Allowed Origins: {string.Join(",", connectionString)}");
        var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();

  
        // AddAsync services to the container.
        builder.Services.AddDbContext<RentItNowDbContext>(options =>
        options.UseNpgsql(connectionString, npgsqlOptions =>
            npgsqlOptions.EnableRetryOnFailure(
                errorCodesToAdd: null,
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30))
            )
       );
        // options.UseSqlServer(connectionString, sqlOptions =>
        //     sqlOptions.EnableRetryOnFailure(
        //         maxRetryCount: 5,
        //         maxRetryDelay: TimeSpan.FromSeconds(30),
        //         errorNumbersToAdd: null)
        //     )
        //);
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
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
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
        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
        {
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        })
        .AddCookie("Identity.Application", options =>
        {
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        })
        .AddCookie(IdentityConstants.ExternalScheme, options =>
        {
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        })
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
            options.CheckConsentNeeded = context => true;
            options.MinimumSameSitePolicy = SameSiteMode.None;
            options.Secure = CookieSecurePolicy.Always;
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
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IRenterService, RenterService>();
        // Register Unit of Work
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register Helpers
        builder.Services.AddScoped<JwtTokenHelper>();
        builder.Services.AddScoped<RolesHelper>();

        var app = builder.Build();



        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();

        }
        else
        {
            // Apply migrations automatically
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<RentItNowDbContext>();
                try
                {
                    context.Database.OpenConnection();
                    context.Database.CloseConnection();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to connect to the database: {ex.Message}");
                    // Handle the exception (e.g., log it, rethrow it, etc.)
                    throw;
                }

                context.Database.Migrate();
            }
        }

        app.UseForwardedHeaders();
        app.UseHttpsRedirection();
        app.UseCors("AllowAnyOrigin");
        app.MapHub<RentalRequestHub>("/chat");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
