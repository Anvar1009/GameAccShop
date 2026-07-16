using Application.DTOs.ChatDTOs;
using Application.Interfaces.ServiceInterface;
using Domain.Models.ChatModels;
using GameAccShop.Controllers.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub> _chatHub;

        public ChatController(IChatService chatService, IHubContext<ChatHub> chatHub)
        {
            _chatService = chatService;
            _chatHub = chatHub;
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendMessage(SendMessageRequest message)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            var mes = await _chatService.SendMessageAsync(message, currentUserId);
            return Ok(mes);
        }

        [HttpPut("{conversationId}/ReadMessage")]
        [Authorize]
        public async Task<IActionResult> Read( int conversationId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            await _chatService.MarkAsReadAsync(conversationId, currentUserId);

            // The reader may not be on the hub (this is the REST fallback), but
            // the sender still needs its ticks updated live.
            await _chatHub.Clients
                .Group(ChatHub.GroupName(conversationId))
                .SendAsync("MessagesRead", conversationId, currentUserId);

            return Ok();
        }

        [HttpGet("{conversationId}/UnReadMessageCount")]
        [Authorize]
        public async Task<IActionResult> UnReadCount(int conversationId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            var count = await _chatService.GetUnreadCountAsync(conversationId, currentUserId);
            return Ok(count);
        }
    }
}
