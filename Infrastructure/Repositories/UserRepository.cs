using Application.DTOs.RegisterDTO;
using Application.Interfaces.Repositories_interface;
using Domain.Models.Abstracts;
using Domain.Models.UserModels;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepositories
    {
        private readonly DbContextModel _dbContextModel;
        public UserRepository(DbContextModel dbContext)
        {
            _dbContextModel = dbContext;
            
        }

        public async Task<User> GetByLoginAsycn(string login)
        {
            var result = await _dbContextModel.Users.FirstOrDefaultAsync(u => u.Login == login);
            if (result == null) 
            {
                return null;
            }
            return result;  
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            var result = await _dbContextModel.Users.AsNoTracking()
                .Include(o=>o.Products)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            return result;  
        }

        public async Task<List<User>> GetAdminsAsync()
        {
            return await _dbContextModel.Users.AsNoTracking()
                .Where(u => u.Role == Role.Admin || u.Role == Role.Super_Aamin)
                .ToListAsync();
        }

        public async Task<int> CountAsync()
        {
            return await _dbContextModel.Users.CountAsync();
        }

        public async Task<Dictionary<DateTime, int>> GetRegistrationCountsByDayAsync(DateTime fromDateUtc)
        {
            return await _dbContextModel.Users
                .Where(u => u.CreatedAt >= fromDateUtc)
                .GroupBy(u => u.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Date, x => x.Count);
        }

        public async Task<User> Register(User user)
        {
            _dbContextModel.Users.Add(user);

            await _dbContextModel.SaveChangesAsync();

            return user;
        }
    }
}
