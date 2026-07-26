using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories_interface
{
    public interface IDisputeRepository
    {
        Task CreateAsync(Dispute dispute);

        Task<Dispute?> GetByIdAsync(int id);

        Task<Dispute?> GetByOrderIdAsync(int orderId);

        // for admin panel
        Task<List<Dispute>> GetAllAsync();

        Task<List<Dispute>> GetByUserIdAsync(int userId);

        Task UpdateAsync(Dispute dispute);

        Task<bool> ExistsOpenDisputeAsync(int orderId);
    }
}
