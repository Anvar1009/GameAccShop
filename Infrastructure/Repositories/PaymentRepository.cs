using Application.Interfaces.Repositories_interface;
using Domain.Models.PaymentModel;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PaymentRepository:IPaymentRepository
    {
        private readonly DbContextModel _dbContext;
        public PaymentRepository(DbContextModel dbContext)
        {
            _dbContext = dbContext;            
        }

        public async Task CreateAsync(Payment payment)
        {
            await _dbContext.Payment.AddAsync(payment);
            await _dbContext.SaveChangesAsync();
        }

        public Task<List<Payment>> GetAllAsync()
        {
            var result = _dbContext.Payment.AsNoTracking()
                .Include(o => o.Order).ThenInclude(o => o.Product)
                .Include(o => o.Order).ThenInclude(o => o.Seller)
                .Include(o => o.Order).ThenInclude(o => o.Buyer)
                .Include(o => o.PaymentAccount)
                .ToListAsync();
            return result;
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            var result = await _dbContext.Payment.AsNoTracking()
                .Include(o=>o.Order).ThenInclude(o => o.Seller)
                .Include(o=>o.Order).ThenInclude(o => o.Buyer)
                .Include(o=>o.Order).ThenInclude(o => o.Product)
                .Include(o=>o.Order).ThenInclude(o => o.Product).ThenInclude(p => p.Medias)
                .Include(o=>o.Order).ThenInclude(o => o.Product).ThenInclude(p => p.Tags)
                .Include(o=>o.PaymentAccount)
                .FirstOrDefaultAsync(p => p.Id == id);

            return result;
        }

        public async Task<Payment?> GetByOrderIdAsync(int orderId)
        {
            return await _dbContext.Payment
                .AsNoTracking()
                .Include(p => p.PaymentAccount)
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderId == orderId);
        }

        public async Task<Payment?> GetDetailsAsync(int PaymentId)
        {
            var result = await _dbContext.Payment.AsNoTracking()
               .Include(o => o.Order)
                    .ThenInclude(o => o.Product)
                    .ThenInclude(p => p.Medias)
               .Include(o => o.Order)
                    .ThenInclude(o => o.Product)
                    .ThenInclude(p => p.Tags)
               .Include(o=>o.Order)
                .ThenInclude(o=>o.Seller)
               .Include(o=>o.Order)
                .ThenInclude(o=>o.Buyer)
               .Include(o => o.PaymentAccount)
               .FirstOrDefaultAsync(p => p.Id == PaymentId);

            return result;
        }

        public async Task UpdateAsync(Payment payment)
        {
             _dbContext.Payment.Update(payment);
            await _dbContext.SaveChangesAsync();
        }
    }
}
