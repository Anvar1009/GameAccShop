using Application.Interfaces.Repositories_interface;
using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.OrderRepoFolder
{
    public class OrderRepository : IOrderRepository
    {
        public Task CreateAsync(Order order)
        {
            throw new NotImplementedException();
        }

        public Task<List<Order>> GetBuyerOrders(int buyerId)
        {
            throw new NotImplementedException();
        }

        public Task<Order?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Order>> GetSellerOrders(int sellerId)
        {
            throw new NotImplementedException();
        }
    }
}
