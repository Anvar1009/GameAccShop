using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminPaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public AdminPaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _paymentService.GetPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]    
        public async Task<IActionResult> GetPaymentDetails(int id)
        {
            var payment = await _paymentService.GetPaymentDetailsAsync(id);
            
            return Ok(payment);
        }

        [HttpPut("{id}/confrim")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmPayment(int id)
        {
            await _paymentService.ConfirmPaymentAsync(id);
            return Ok();
        }


        [HttpPut("{id}/released")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReleasePayment(int id)
        {
            await _paymentService.ReleasePaymentAsync(id);
            return Ok();
        }
    }
}
