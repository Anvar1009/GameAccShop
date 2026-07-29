using Application.DTOs.RegisterDTO;
using Application.Exceptions;
using Application.Interfaces.Provider;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.Security;
using Application.Interfaces.ServiceInterface;
using Application.Interfaces.UnitOfWorkFolder;
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
        private readonly IVerificationService _verificationService;
        private readonly IGoogleAuthProvider _googleAuthProvider;
        private readonly IUnitOfWork _unitOfWork;
        public AuthService(
            IUserRepositories userRepositories,
            IPasswordHasher hasher,
            IJwtProvider provider,
            IVerificationService verificationService,
            IGoogleAuthProvider googleAuthProvider,
            IUnitOfWork unitOfWork)
        {
            _userRepositories = userRepositories;
            passwordHasher = hasher;
            jwtProvider = provider;
            _verificationService = verificationService;
            _googleAuthProvider = googleAuthProvider;
            _unitOfWork = unitOfWork;

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="requestRegisterDTO"></param>
        /// <returns></returns>
        /// <exception cref="LoginAlreadyExistsException"></exception>
        public async Task<ResponseRegisterDTO> Register_Service(RequestRegisterDTO requestRegisterDTO)
        {
            // bu login (email) mavjudligini tekshiradi
            var existingUser = await _userRepositories.GetByLoginAsycn(requestRegisterDTO.Login);

            if (existingUser != null && existingUser.EmailConfirmed)
            {
                throw new LoginAlreadyExistsException();
            }

            string hashedPassword = passwordHasher.HashPassword(requestRegisterDTO.Password);

            User user;

            if (existingUser != null)
            {
                // Oldingi ro'yxatdan o'tish tugallanmagan (email tasdiqlanmagan) — ma'lumotlarni yangilab, kodni qayta yuboramiz.
                existingUser.FirstName = requestRegisterDTO.FirstName;
                existingUser.LastName = requestRegisterDTO.LastName;
                existingUser.PhoneNumber = requestRegisterDTO.PhoneNumber;
                existingUser.PasswordHash = hashedPassword;

                user = existingUser;
            }
            else
            {
                user = new User()
                {
                    FirstName = requestRegisterDTO.FirstName,
                    LastName = requestRegisterDTO.LastName,
                    PhoneNumber = requestRegisterDTO.PhoneNumber,
                    PasswordHash = hashedPassword,
                    Login = requestRegisterDTO.Login,
                    IsActive = true,
                    EmailConfirmed = false,
                    Role = Domain.Models.Abstracts.Role.User,
                    CreatedAt = DateTime.UtcNow
                };

                user = await _userRepositories.Register(user);
            }

            await _verificationService.SendVerificationCodeAsync(user);

            ResponseRegisterDTO responseRegisterDTO = new ResponseRegisterDTO()
            {
                UserId = user.Id,
                Describtion = "Emailingizga tasdiqlash kodi yuborildi. Iltimos, kodni kiriting."
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

            if (!user.EmailConfirmed)
            {
                throw new EmailNotVerifiedException();
            }

            LoginResponseDTO responseDTO = new LoginResponseDTO()
            {
                UserId = user.Id,
                Login = user.Login,
                Token = jwtProvider.GenerateToken(user)
            };

            return responseDTO;

        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="verifyRequest"></param>
        /// <returns></returns>
        /// <exception cref="InvalidVerificationCodeException"></exception>
        public async Task<LoginResponseDTO> VerifyEmail_Service(VerifyEmailRequestDTO verifyRequest)
        {
            var user = await _verificationService.VerifyCodeAsync(verifyRequest.Login, verifyRequest.Code);

            LoginResponseDTO responseDTO = new LoginResponseDTO()
            {
                UserId = user.Id,
                Login = user.Login,
                Token = jwtProvider.GenerateToken(user)
            };

            return responseDTO;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="resendRequest"></param>
        /// <returns></returns>
        public async Task ResendCode_Service(ResendCodeRequestDTO resendRequest)
        {
            await _verificationService.ResendCodeAsync(resendRequest.Login);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="googleRequest"></param>
        /// <returns></returns>
        /// <exception cref="InvalidGoogleTokenException"></exception>
        public async Task<LoginResponseDTO> GoogleAuth_Service(GoogleAuthRequestDTO googleRequest)
        {
            var googleUser = await _googleAuthProvider.ValidateAsync(googleRequest.IdToken);

            var user = await _userRepositories.GetByLoginAsycn(googleUser.Email);

            if (user == null)
            {
                user = new User()
                {
                    FirstName = googleUser.FirstName,
                    LastName = googleUser.LastName,
                    Login = googleUser.Email,
                    // Google akkaunti orqali kirganlar parol bilan kira olmasin — taxmin qilib bo'lmaydigan hash qo'yiladi.
                    PasswordHash = passwordHasher.HashPassword(Guid.NewGuid().ToString("N")),
                    PhoneNumber = string.Empty,
                    IsActive = true,
                    EmailConfirmed = true,
                    Role = Domain.Models.Abstracts.Role.User,
                    CreatedAt = DateTime.UtcNow
                };

                user = await _userRepositories.Register(user);
            }
            else if (!user.EmailConfirmed)
            {
                // Google email egaligini allaqachon tasdiqlagan — qo'lda tasdiqlashni talab qilmaymiz.
                user.EmailConfirmed = true;
                await _unitOfWork.SaveChangesAsync();
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
