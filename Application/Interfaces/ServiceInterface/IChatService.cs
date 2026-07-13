using Application.DTOs.ChatDTOs;
using Domain.Models.ChatModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IChatService
    {
        Task<ConversationResponse?> GetByOrderIdAsync(int orderId, int currentUserId);

        Task<Conversation> CreateConversationAsync(int orderId);

        Task<MessageResponse> SendMessageAsync(SendMessageRequest request, int senderId);

        Task<List<MessageResponse>> GetMessagesAsync(int conversationId, int currentUserId);

        Task<int> GetUnreadCountAsync(int conversationId, int userId);

        Task MarkAsReadAsync(int conversationId, int userId);
    }
}
