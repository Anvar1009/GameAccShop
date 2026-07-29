using Application.DTOs.RegisterDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.ServiceInterface
{
    public interface IAuthService
    {
        public Task<ResponseRegisterDTO> Register_Service(RequestRegisterDTO requestRegisterDTO);
        public  Task<LoginResponseDTO> Login_Service(LoginRequestDTO loginRequest);
        public Task<LoginResponseDTO> VerifyEmail_Service(VerifyEmailRequestDTO verifyRequest);
        public Task ResendCode_Service(ResendCodeRequestDTO resendRequest);
        public Task<LoginResponseDTO> GoogleAuth_Service(GoogleAuthRequestDTO googleRequest);
    }
}
