using Application.DTOs.PaymentDTO;
using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerPaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public BuyerPaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;            
        }

        [HttpGet("{orderId}/details")]
        [Authorize]
        public async Task<IActionResult> GetPaymentDetails(int orderId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var buyerId))
            {
                return Unauthorized();
            }
            var paymentDetails = await _paymentService.GetBuyerPaymentDetailsAsync(buyerId, orderId);
            return Ok(paymentDetails);
        }

      
    }
}
