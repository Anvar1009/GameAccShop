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

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            return Ok(User.Identity?.Name);
        }
    }
}
