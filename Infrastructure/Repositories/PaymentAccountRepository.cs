using Application.Interfaces.Repositories_interface;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PaymentAccountRepository : IPaymentAccountRepository
    {
        public Task CreateAsync(PaymentAccount paymentAccount)
        {
            throw new NotImplementedException();
        }

        public Task<PaymentAccount?> GetActiveAsync()
        {
            throw new NotImplementedException();
        }

        public Task<PaymentAccount?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(PaymentAccount paymentAccount)
        {
            throw new NotImplementedException();
        }
    }
}
