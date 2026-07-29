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

        // for admin panel
        Task<List<Order>> GetOrders();


        Task<List<Order>> GetBuyerOrders(int buyerId);

        Task<List<Order>> GetSellerOrders(int sellerId);

        Task<Order?> GetByIdAsync(int id);

        Task UpdateAsync(Order order);

        /// <summary>True if any order for this product has a confirmed or released payment.</summary>
        Task<bool> HasPaidOrderAsync(int productId);
    }
}
