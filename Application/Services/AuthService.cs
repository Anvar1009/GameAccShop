using Application.DTOs.RegisterDTO;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.Security;
using Application.Interfaces.ServiceInterface;
using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class AuthService:IAuthService
    {
        private readonly IUserRepositories _userRepositories;
        private readonly IPasswordHasher passwordHasher; 
        public AuthService(IUserRepositories userRepositories, IPasswordHasher hasher)
        {
            _userRepositories = userRepositories;
            passwordHasher = hasher;
            
        }

        public async Task<ResponseRegisterDTO> Register_Service(RequestRegisterDTO requestRegisterDTO)
        {
            User user = new User()
            {
                FirstName = requestRegisterDTO.FirstName,
                LastName = requestRegisterDTO.LastName,
                PhoneNumber = requestRegisterDTO.PhoneNumber,
                PasswordHash = requestRegisterDTO.Password,
                Login=requestRegisterDTO.Login,
                IsActive=true,
                Role = Domain.Models.Abstracts.Role.User,
                CreatedAt=DateTime.UtcNow
            };

            string str = passwordHasher.HashPassword(user.PasswordHash);
            user.PasswordHash=str;

            var result = await _userRepositories.Register(user);

            ResponseRegisterDTO responseRegisterDTO = new ResponseRegisterDTO()
            {
                UserId = result.Id,
                Describtion = "Registratsiyadan o'tdingiz!"
            };

            return responseRegisterDTO;
        }

        public async Task<LoginResponseDTO> Login_Service(LoginRequestDTO loginRequest)
        {
            User user = await _userRepositories.GetByLoginAsycn(loginRequest.Login);

            bool verify = passwordHasher.VerifyPassword(loginRequest.Password, user.PasswordHash);

            if (user is not null && verify)
            {

                LoginResponseDTO responseDTO = new LoginResponseDTO()
                {
                    UserId = user.Id,
                    Login = user.Login,
                    Token = ""
                };

                return responseDTO;
            }

            return null;
        }
    }
}
