using Application.Interfaces.ServiceInterface;
using Domain.Models.Abstracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminOrderController : ControllerBase
    {
        private readonly IAdminOrderService _adminOrderService;
        public AdminOrderController(IAdminOrderService adminOrderService)
        {
            _adminOrderService = adminOrderService;
        }

        [HttpGet("{orderId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var orderDetails = await _adminOrderService.GetOrderDetailsAsync(orderId);
            return Ok(orderDetails);
        }

        [HttpGet]
        [Authorize(Roles = " Admin")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _adminOrderService.GetOrdersAsync();
            return Ok(orders);
        }

    }
}
