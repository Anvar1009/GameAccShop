using Application.DTOs.ChatDTOs;
using Application.Exceptions;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Domain.Models.ChatModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ChatService : IChatService
    {

        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatService(IConversationRepository conversationRepository, IMessageRepository messageRepository)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
        }

        public async Task<Conversation> CreateConversationAsync(int orderId)
        {
            Conversation existingConversation = new Conversation()
            {
                OrderId = orderId,
                Messages = new List<Message>(),
                CreatedAt= DateTime.UtcNow,                
            };
            return await _conversationRepository.CreateAsync(existingConversation);
        }

        public async Task<ConversationResponse?> GetByOrderIdAsync(int orderId, int currentUserId)
        {
            var conversation = await _conversationRepository.GetByOrderIdAsync(orderId);
            if (conversation == null)
                throw new ConversationNotFoundException();

            ConversationResponse conversationResponse;
            conversationResponse = new ConversationResponse
            {
                ConversationId = conversation.Id,
                OrderId = conversation.OrderId,
                Messages = conversation.Messages.Select(m => new MessageResponse
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    CreatedAt = m.CreatedAt,
                    Text = m.Text,
                    IsMine = m.SenderId==currentUserId, 
                    SenderName = $"{m.Sender.FirstName} {m.Sender.LastName}"
                }).ToList()
            };

            return conversationResponse;
        }

        public async Task<List<MessageResponse>> GetMessagesAsync(int conversationId)
        {
            var messages = await _messageRepository.GetMessagesAsync(conversationId);

            return messages.Select(message => new MessageResponse
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = $"{message.Sender.FirstName} {message.Sender.LastName}",
                Text = message.Text,
                CreatedAt = message.CreatedAt
            }).ToList();
        }

        public async Task<int> GetUnreadCountAsync(int conversationId, int userId)
        {
            var unreadCount = await _messageRepository.GetUnreadCountAsync(conversationId, userId);

            return unreadCount;
        }

        public async Task MarkAsReadAsync(int conversationId, int userId)
        {
            await _messageRepository.MarkAsReadAsync(conversationId, userId);

        }

        public async Task<MessageResponse> SendMessageAsync(SendMessageRequest request, int senderId)
        {
            Message message = new Message
            {
                ConversationId = request.OrderId,
                SenderId = senderId,
                Text = request.Text,
                CreatedAt = DateTime.UtcNow
            };

            var createdMessage = await _messageRepository.CreateAsync(message);

            return new MessageResponse
            {
                Id = createdMessage.Id,
                SenderId = createdMessage.SenderId,
                SenderName = $"{createdMessage.Sender.FirstName} {createdMessage.Sender.LastName}",
                Text = createdMessage.Text,
                CreatedAt = createdMessage.CreatedAt
            };
        }
    }
}
