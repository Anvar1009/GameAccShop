using Application.DTOs.RegisterDTO;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService service)
        {
            _authService = service;
        }
        [HttpPost]
        public async Task<ActionResult<ResponseRegisterDTO>> Registration(RequestRegisterDTO requestRegisterDTO)
        {
            if (requestRegisterDTO == null)
            {
                return BadRequest("Request is null");
            }
            
            var result = await _authService.Register_Service(requestRegisterDTO); 
            return Ok(result);
        }
    }
}
