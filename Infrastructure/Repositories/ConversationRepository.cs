using Application.Interfaces.Repositories_interface;
using Domain.Models.ChatModels;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly DbContextModel _dbContext;
        public ConversationRepository(DbContextModel dbContextModel)
        {
            
            _dbContext = dbContextModel;
        }
        public async Task<Conversation> CreateAsync(Conversation conversation)
        {
            await _dbContext.Conversations.AddAsync(conversation);
            return conversation!;
        }

        public async Task<Conversation?> GetByOrderIdAsync(int orderId)
        {
            return await _dbContext.Conversations.AsNoTracking()
                       .Include(c => c.Messages).ThenInclude(o => o.Sender)
                       .Include(c => c.Order)
                       .FirstOrDefaultAsync(c => c.OrderId == orderId);
        }
        public async Task<Conversation?> GetByIdAsync(int conversationId)
        {
            return await _dbContext.Conversations
                .Include(c => c.Order)
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }
    }
}
