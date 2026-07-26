using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminStatsController : ControllerBase
    {
        private readonly IAdminStatsService _adminStatsService;

        public AdminStatsController(IAdminStatsService adminStatsService)
        {
            _adminStatsService = adminStatsService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _adminStatsService.GetStatsAsync();
            return Ok(stats);
        }
    }
}
