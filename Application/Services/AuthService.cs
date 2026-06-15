using Application.DTOs.RegisterDTO;
using Application.Exceptions;
using Application.Interfaces.Provider;
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
        private readonly IJwtProvider jwtProvider;
        public AuthService(IUserRepositories userRepositories, IPasswordHasher hasher, IJwtProvider provider)
        {
            _userRepositories = userRepositories;
            passwordHasher = hasher;
            jwtProvider = provider;
            
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="requestRegisterDTO"></param>
        /// <returns></returns>
        /// <exception cref="LoginAlreadyExistsException"></exception>
        public async Task<ResponseRegisterDTO> Register_Service(RequestRegisterDTO requestRegisterDTO)
        {
            // bu login mavjudligini tekshiradi
            var existingUser = await _userRepositories.GetByLoginAsycn(requestRegisterDTO.Login);

            if (existingUser != null)
            {
                throw new LoginAlreadyExistsException();
            }

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



        /// <summary>
        /// 
        /// </summary>
        /// <param name="loginRequest"></param>
        /// <returns></returns>
        /// <exception cref="InvalidCredentialsException"></exception>
        public async Task<LoginResponseDTO> Login_Service(LoginRequestDTO loginRequest)
        {
            User user = await _userRepositories.GetByLoginAsycn(loginRequest.Login);

            if (user == null)
            {
                throw new InvalidCredentialsException();
            }

            bool verify = passwordHasher.VerifyPassword(loginRequest.Password, user.PasswordHash);

            if (!verify)
            {
                throw new InvalidCredentialsException();
            }

           
                LoginResponseDTO responseDTO = new LoginResponseDTO()
                {
                    UserId = user.Id,
                    Login = user.Login,
                    Token = jwtProvider.GenerateToken(user)
                };

                return responseDTO;
           
        }
    }
}
