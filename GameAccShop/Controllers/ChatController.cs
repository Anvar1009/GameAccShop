using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        public ChatController(IChatService chatService)
        {
            _chatService = chatService;            
        }

        [HttpGet("{orderId}")]
        [Authorize]
        public async Task<IActionResult> GetConversation(int orderId)
        {
            var userId =  User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var currentUserId))
            {
                return Unauthorized();
            }

            var conv = await _chatService.GetByOrderIdAsync(orderId, currentUserId);

            return Ok(conv);
        }

        [Authorize]
        [HttpGet("{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            var messages = await _chatService.GetMessagesAsync(conversationId, currentUserId);

            return Ok(messages);
        }


    }
}
