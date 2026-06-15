
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.Security;
using Application.Interfaces.ServiceInterface;
using Application.Services;
using GameAccShop.Middleware.GlobalExceptionMiddleware;
using Infrastructure.EntityModel;
using Infrastructure.Repositories.UserRepositoryFolder;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace GameAccShop
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();   
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddDbContext<DbContextModel>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


            builder.Services.AddScoped<IUserRepositories, UserRepository>();
            builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
            builder.Services.AddScoped<IAuthService, AuthService>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();


            app.UseMiddleware<GlobalExceptionMiddleware>();


            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
