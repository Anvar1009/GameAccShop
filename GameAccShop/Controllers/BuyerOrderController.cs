using Application.DTOs.OrderDTO;
using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerOrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public BuyerOrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetOrdersAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var buyerId))
            {
                return Unauthorized();
            }
            var result = await _orderService.GetBuyerOrdersAsync(buyerId);
            return Ok(result);
        }

        [HttpGet("{orderId}")]
        [Authorize]
        public async Task<IActionResult> GetOrderDetailsAsync(int orderId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var buyerId))
            {
                return Unauthorized();
            }
            var result = await _orderService.GetBuyerOrderDetailsAsync(buyerId, orderId);
            return Ok(result);
        }

       

    }
}
