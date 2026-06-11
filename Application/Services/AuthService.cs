using Application.Interfaces.Repositories_interface;
using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class AuthService
    {
        private readonly IUserRepositories _userRepositories;
        public AuthService(IUserRepositories userRepositories)
        {
            _userRepositories = userRepositories;
            
        }

    }
}
