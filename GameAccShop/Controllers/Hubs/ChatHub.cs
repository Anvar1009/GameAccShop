using Application.DTOs.ChatDTOs;
using Application.Interfaces.ServiceInterface;
using Domain.Models.ChatModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace GameAccShop.Controllers.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }


        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Connected: {Context.ConnectionId}");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Disconnected: {Context.ConnectionId}");

            await base.OnDisconnectedAsync(exception);
        }




        public async Task JoinConversation(int conversationId)
        {
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new HubException("Unauthorized");

            int userId = int.Parse(claim.Value);

            await _chatService.ValidateConversationAccessAsync(conversationId, userId);

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"conversation-{conversationId}");
        }

        public async Task LeaveConversation(int conversationId)
        {

            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                $"conversation-{conversationId}");
        }



        public async Task SendMessage(SendMessageRequest request)
        {
            // 1. UserId olish
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new HubException("Unauthorized");

            int userId = int.Parse(claim.Value);

          
            // 2. ChatService.SendMessageAsync()

            var response = await _chatService.SendMessageAsync(request, userId);

            // 3. Clients.Group(...).SendAsync(...)

            await Clients
            .Group($"conversation   -{response.ConversationId}")
                .SendAsync("ReceiveMessage", response);
        }


        public async Task Typing(int conversationId)
        {
            await Clients
                .OthersInGroup($"conversation-{conversationId}")
                .SendAsync("Typing");
        }

    }
}
