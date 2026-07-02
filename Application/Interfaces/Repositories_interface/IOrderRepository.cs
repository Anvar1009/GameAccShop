using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories_interface
{
    public interface IOrderRepository
    {
        Task CreateAsync(Order order);

        Task<List<Order>> GetBuyerOrders(int buyerId);

        Task<List<Order>> GetSellerOrders(int sellerId);

        Task<Order?> GetByIdAsync(int id);

        Task UpdateAsync(Order order);
    }
}
