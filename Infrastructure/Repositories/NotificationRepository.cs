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
    public class NotificationRepository : INotificationRepository
    {
        private readonly DbContextModel _dbContextModel;
        public NotificationRepository(DbContextModel dbContextModel)
        {
            _dbContextModel = dbContextModel;

        }
        public async Task CreateAsync(Notification notification)
        {
            await _dbContextModel.notifications.AddAsync(notification);
        }

        public async Task<List<Notification>> GetByUseridAsync(int userId)
        {
            var result = await _dbContextModel.notifications
                .AsNoTracking()
                .Where(o => o.userId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ThenByDescending(o => o.Id)
                .ToListAsync();

            return result;
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            var count = await _dbContextModel.notifications
                .Where(o => o.userId == userId && o.IsRead == false)
                .CountAsync();

            return count;
        }

        public async Task MarkAsReadAsync(int userId)
        {
            await _dbContextModel.notifications
                .Where(o=> o.userId == userId && o.IsRead == false)
                .ExecuteUpdateAsync(s=>s.SetProperty(n=>n.IsRead, true));
        }
    }
}
