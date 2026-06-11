using Application.DTOs.RegisterDTO;
using Application.Interfaces.Repositories_interface;
using Domain.Models.UserModels;
using Infrastructure.EntityModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories.UserRepositoryFolder
{
    public class UserRepository : IUserRepositories
    {
        private readonly DbContextModel _dbContextModel;
        public UserRepository(DbContextModel dbContext)
        {
            _dbContextModel = dbContext;
            
        }

        public Task<User> GetByLoginAsycn(string login)
        {
            throw new NotImplementedException();
        }

        public Task<User> Register(User user)
        {
            throw new NotImplementedException();
        }
    }
}
