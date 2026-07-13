using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IMessageRepository
    {
        Task<Message> CreateAsync(Message message);

        Task<List<Message>> GetMessagesAsync(int conversationId);

        Task<int> GetUnreadCountAsync(int conversationId, int userId);

        Task MarkAsReadAsync(int conversationId, int userId);
    }
}
