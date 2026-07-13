using Domain.Models.ChatModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories_interface
{
    public interface IConversationRepository
    {
        Task<Conversation?> GetByOrderIdAsync(int orderId);
        Task<Conversation> CreateAsync(Conversation conversation);
        Task<Conversation?> GetByIdAsync(int conversationId);
    }
}
