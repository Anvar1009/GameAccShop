using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Application.Interfaces.UnitOfWorkFolder;
using Domain.Models.UserModels;
using Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class VerificationService : IVerificationService
    {
        private readonly IUserRepositories _userRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;

        public VerificationService(
            IUserRepositories userRepository,
            IEmailService emailService, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
        }

        public async Task ResendCodeAsync(string email)
        {
            throw new NotImplementedException();
        }

        public async Task SendVerificationCodeAsync(User user)
        {
            var code = Random.Shared.Next(100000, 999999).ToString();

            user.EmailVerificationCode = code;
            user.EmailVerificationExpires = DateTime.UtcNow.AddMinutes(5);

            await _unitOfWork.SaveChangesAsync();

            await _emailService.SendVerificationCodeAsync(user.Login, code);
        }

        public Task VerifyCodeAsync(string email, string code)
        {
            throw new NotImplementedException();
        }
    }
}
