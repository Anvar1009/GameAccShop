using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IEmailService _emailService;

    public TestController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmail()
    {
        await _emailService.SendVerificationCodeAsync(
            "soxibovanvar1009@gmail.com",
            "582941");

        return Ok("Email yuborildi.");
    }
}