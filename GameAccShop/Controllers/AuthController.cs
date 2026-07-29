using Application.DTOs.RegisterDTO;
using Application.Interfaces.ServiceInterface;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly   IAuthService _authService;
        public AuthController(IAuthService service)
        {
            _authService = service;
        }

        [HttpPost("Registratsiya")]
        public async Task<ActionResult<ResponseRegisterDTO>> Registration(RequestRegisterDTO requestRegisterDTO)
        {
            
            var result = await _authService.Register_Service(requestRegisterDTO); 
            return Ok(result);
        }
        

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(
            LoginRequestDTO request)
        {
            var result = await _authService.Login_Service(request);

            return Ok(result);
        }

        [HttpPost("verify-email")]
        public async Task<ActionResult<LoginResponseDTO>> VerifyEmail(VerifyEmailRequestDTO request)
        {
            var result = await _authService.VerifyEmail_Service(request);

            return Ok(result);
        }

        [HttpPost("resend-code")]
        public async Task<IActionResult> ResendCode(ResendCodeRequestDTO request)
        {
            await _authService.ResendCode_Service(request);

            return Ok(new { message = "Tasdiqlash kodi qayta yuborildi" });
        }

        [HttpPost("google")]
        public async Task<ActionResult<LoginResponseDTO>> GoogleAuth(GoogleAuthRequestDTO request)
        {
            var result = await _authService.GoogleAuth_Service(request);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            return Ok(User.Identity?.Name);
        }
    }
}
