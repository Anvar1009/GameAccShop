using Domain.Models.ChatModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories_interface
{
    public interface INotificationRepository
    {
        Task CreateAsync(Notification notification);

        Task<List<Notification>> GetByUseridAsync(int userId);
        Task<int> GetUnreadCountAsync();
        Task MarkAsReadAsync(int userId);
    }
}
