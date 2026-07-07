using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellerOrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public SellerOrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetOrdersAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userId == null || !int.TryParse(userId.Value, out var sellerId))
            {
                return Unauthorized();
            }

            var result = await _orderService.GetSellerOrdersAsync(sellerId);

            return Ok(result);
        }

        [HttpGet("{orderId}")]
        [Authorize]
        public async Task<IActionResult> GetOrderDetailsAsync(int orderId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var sellerId))
            {
                return Unauthorized();
            }
            var result = await _orderService.GetSellerOrderDetailsAsync(sellerId, orderId);
            return Ok(result);
        }
    }
}
