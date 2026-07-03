using Application.Interfaces.Repositories_interface;
using Domain.Models.OrdersModel;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DbContextModel _context;
        public OrderRepository(DbContextModel dbContextModel)
        {
            _context = dbContextModel;
        }
        public async Task CreateAsync(Order order)
        {
            await _context.orders.AddAsync(order);
        }

        public async Task<List<Order>> GetBuyerOrders(int buyerId)
        {
            var orders = await _context.orders.AsNoTracking()
                .Where(o => o.BuyerId == buyerId)
                                       .Include(o => o.Product)
                                            .ThenInclude(c=>c.Medias)
                                       .Include(o => o.Seller)
                                       .Include(o => o.Product)
                                            .ThenInclude(c => c.Tags)
                                       .Include(o => o.Payment)
                                       .OrderByDescending(o => o.CreatedAt)
                                       .ToListAsync();
            return orders;
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            var order = await _context.orders.AsNoTracking()
                                       .Include(o => o.Product).ThenInclude(c => c.Medias)
                                       .Include(o => o.Product).ThenInclude(c => c.Tags)
                                       .Include(o => o.Seller)
                                       .Include(o => o.Buyer)
                                       .Include(o => o.Payment)
                                       .FirstOrDefaultAsync(o => o.Id == id);
            return order;
        }

        public async Task<List<Order>> GetSellerOrders(int sellerId)
        {
            var orders = await _context.orders.AsNoTracking()
                .Where(o => o.SellerId == sellerId)
                                        .Include(o => o.Product).ThenInclude(o=>o.Medias)
                                        .Include(o => o.Product).ThenInclude(o=>o.Tags)
                                        .Include(o => o.Buyer)
                                        .Include(o=>o.Payment)
                                        .OrderByDescending(o => o.CreatedAt)
                                        .ToListAsync();
            return orders;
        }

        public Task UpdateAsync(Order order)
        {
            _context.orders.Update(order);
            return Task.CompletedTask;
        }
    }
}
