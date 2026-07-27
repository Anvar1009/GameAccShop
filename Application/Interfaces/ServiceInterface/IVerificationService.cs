using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IVerificationService
    {
        Task SendVerificationCodeAsync(User user);

        Task VerifyCodeAsync(string email, string code);

        Task ResendCodeAsync(string email);
    }
}
