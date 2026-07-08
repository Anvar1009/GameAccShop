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
    public class PaymentAccountRepository : IPaymentAccountRepository
    {
        private readonly DbContextModel _dbContext;
        public PaymentAccountRepository(DbContextModel dbContextModel)
        {
            _dbContext = dbContextModel;
        }

        public async  Task CreateAsync(PaymentAccount paymentAccount)
        {
           await _dbContext.AddAsync(paymentAccount);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(PaymentAccount paymentAccount)
        {
            _dbContext.Remove(paymentAccount);
        }

        public async Task<PaymentAccount?> GetActiveAsync()
        {
            return await _dbContext.PaymentAccounts
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.IsActive);
        }

        public async Task<PaymentAccount?> GetByIdAsync(int id)
        {
            return await _dbContext.PaymentAccounts
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task UpdateAsync(PaymentAccount paymentAccount)
        {
            _dbContext.Update(paymentAccount);

            await _dbContext.SaveChangesAsync();
        }
    }
}
