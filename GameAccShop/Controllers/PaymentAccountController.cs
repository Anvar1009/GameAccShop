using Application.DTOs.OrderDTO;
using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentAccountController : ControllerBase
    {
        private readonly IPaymentAccountService _paymentAccountService;

        public PaymentAccountController(IPaymentAccountService paymentAccountService)
        {
            _paymentAccountService = paymentAccountService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetActivePaymentAccount()
        {
            var activePaymentAccount = await _paymentAccountService.GetActiveAsync();
            
            return Ok(activePaymentAccount);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPaymentAccountById(int id)
        {
            var paymentAccount = await _paymentAccountService.GetByIdAsync(id);
            
            return Ok(paymentAccount);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreatePaymentAccount([FromBody] CreateRequestPaymentAccount request)
        {
            await _paymentAccountService.CreateAsync(request);
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePaymentAccount(int id, [FromBody] CreateRequestPaymentAccount request)
        {
            await _paymentAccountService.UpdateAsync(id, request);
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = " Admin")]
        public async Task<IActionResult> DeletePaymentAccount(int id)
        {
            await _paymentAccountService.DeleteAsync(id);

            return Ok();
        }

    }
}
