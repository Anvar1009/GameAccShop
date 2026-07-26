using Application.DTOs.DisputeDTO;
using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisputeController : ControllerBase
    {
        private readonly IDisputeService _disputeService;

        public DisputeController(IDisputeService disputeService)
        {
            _disputeService = disputeService;
        }


        // ── Buyer / Seller ───────────────────────────────────────────────

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> OpenDisputeAsync([FromBody] OpenDisputeRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var currentUserId))
            {
                return Unauthorized();
            }

            var result = await _disputeService.OpenDisputeAsync(currentUserId, request);
            return Ok(result);
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyDisputesAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var currentUserId))
            {
                return Unauthorized();
            }

            var result = await _disputeService.GetMyDisputesAsync(currentUserId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetDisputeByIdAsync(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var currentUserId))
            {
                return Unauthorized();
            }

            var result = await _disputeService.GetDisputeByIdAsync(id, currentUserId, User.IsInRole("Admin"));
            return Ok(result);
        }


        // ── Admin ────────────────────────────────────────────────────────

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllDisputesAsync()
        {
            var result = await _disputeService.GetAllDisputesAsync();
            return Ok(result);
        }

        [HttpPut("{id}/review")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> StartReviewAsync(int id)
        {
            await _disputeService.StartReviewAsync(id);
            return Ok();
        }

        [HttpPut("{id}/waiting-evidence")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RequestEvidenceAsync(int id)
        {
            await _disputeService.RequestEvidenceAsync(id);
            return Ok();
        }

        [HttpPut("{id}/resolve-buyer")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResolveBuyerAsync(int id, [FromBody] ResolveDisputeRequest request)
        {
            await _disputeService.ResolveBuyerAsync(id, request);
            return Ok();
        }

        [HttpPut("{id}/resolve-seller")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResolveSellerAsync(int id, [FromBody] ResolveDisputeRequest request)
        {
            await _disputeService.ResolveSellerAsync(id, request);
            return Ok();
        }

        [HttpPut("{id}/close")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CloseAsync(int id)
        {
            await _disputeService.CloseAsync(id);
            return Ok();
        }
    }
}
