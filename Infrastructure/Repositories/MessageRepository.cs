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
    public class MessageRepository : IMessageRepository
    {
        private readonly DbContextModel _dbContext;

        public MessageRepository(DbContextModel dbContextModel)
        {
            _dbContext = dbContextModel;            
        }
        public async Task<Message> CreateAsync(Message message)
        {
            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();
            // Load the Sender so callers can build SenderName without a NRE.
            await _dbContext.Entry(message).Reference(m => m.Sender).LoadAsync();
            return message;
        }

        public async Task<List<Message>> GetMessagesAsync(int conversationId)
        {
            return await _dbContext.Messages.AsNoTracking()
                .Where(m => m.ConversationId == conversationId)
                .Include(o=> o.Sender)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(int conversationId, int userId)
        {
            var count = await _dbContext.Messages
                .Where(m => m.ConversationId == conversationId && m.SenderId != userId && !m.IsRead)
                .CountAsync();
            return count;
        }

        public async Task MarkAsReadAsync(int conversationId, int userId)
        {
            await _dbContext.Messages
                .Where(m => m.ConversationId == conversationId && m.SenderId != userId && !m.IsRead)
                .ExecuteUpdateAsync(x =>x.SetProperty(m => m.IsRead, true));
            await _dbContext.SaveChangesAsync();
        }
    }
}
