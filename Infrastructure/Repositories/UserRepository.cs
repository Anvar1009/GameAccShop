using Application.DTOs.RegisterDTO;
using Application.Interfaces.Repositories_interface;
using Domain.Models.UserModels;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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

        public async Task<User> Register(User user)
        {
            _dbContextModel.Users.Add(user);

            await _dbContextModel.SaveChangesAsync();

            return user;
        }
    }
}
