using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentItNow.configurations;
using RentItNow.Data;
using RentItNow.Helpers;
using RentItNow.Models;
using System.Reflection.Emit;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var jwtKey = builder.Configuration.GetSection("JwtSettings:Key").Get<string>();
        var jwtIssuer = builder.Configuration.GetSection("JwtSettings:Issuer").Get<string>();
        // AddAsync services to the container.

        builder.Services.AddDbContext<RentItNowDbContext>(
            options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
       );
        builder.Services.AddCors(
        options =>
        {
            options.AddPolicy("AllowAnyOrigin",
               builder =>
               {
                   builder.AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithOrigins("http://localhost:44375", "https://localhost:7125")
                            .AllowCredentials();
               });

        });


        builder.Services.AddSwaggerGen();
        builder.Services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<RentItNowDbContext>()
        .AddDefaultTokenProviders();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
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
                ValidAudience = jwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        })
        .AddGoogle(options =>
        {
            options.ClientId = "604527366317-u7t19epden2etnr0m5h4jum6ir634fnd.apps.googleusercontent.com";
            options.ClientSecret = "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";
            options.CallbackPath = "/api/Auth/google-callback";
        })
        ;
        builder.Services.AddAuthorization();
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        builder.Services.AddScoped<UserManager<User>>();
        builder.Services.AddScoped<SignInManager<User>>();
        builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, UserClaimsPrincipalFactory<User, IdentityRole>>();
        builder.Services.AddScoped<IUnitOfWork,UnitOfWork>();
        builder.Services.AddScoped<JwtTokenHelper>();
        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        app.UseCors();
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();
        
        app.MapControllers();

        app.Run();
    }
}