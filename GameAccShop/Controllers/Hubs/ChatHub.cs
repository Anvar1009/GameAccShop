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

        // Every join/broadcast must agree on the group name, so it is built in
        // exactly one place.
        public static string GroupName(int conversationId) =>
            $"conversation-{conversationId}";

        private int CurrentUserId()
        {
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new HubException("Unauthorized");

            return int.Parse(claim.Value);
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
            int userId = CurrentUserId();

            await _chatService.ValidateConversationAccessAsync(conversationId, userId);

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                GroupName(conversationId));
        }

        public async Task LeaveConversation(int conversationId)
        {

            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                GroupName(conversationId));
        }



        public async Task SendMessage(SendMessageRequest request)
        {
            int userId = CurrentUserId();

            var response = await _chatService.SendMessageAsync(request, userId);

            // Goes to the whole group, sender included — the sender's own client
            // replaces its optimistic bubble with this persisted copy.
            await Clients
                .Group(GroupName(response.ConversationId))
                .SendAsync("ReceiveMessage", response);
        }


        public async Task Typing(int conversationId)
        {
            await Clients
                .OthersInGroup(GroupName(conversationId))
                .SendAsync("Typing");
        }


        /// <summary>
        /// The reader marks the other party's messages as seen; the sender is
        /// told live so its ticks can turn to "read".
        /// </summary>
        public async Task MarkAsRead(int conversationId)
        {
            int userId = CurrentUserId();

            await _chatService.MarkAsReadAsync(conversationId, userId);

            await Clients
                .OthersInGroup(GroupName(conversationId))
                .SendAsync("MessagesRead", conversationId, userId);
        }

    }
}
