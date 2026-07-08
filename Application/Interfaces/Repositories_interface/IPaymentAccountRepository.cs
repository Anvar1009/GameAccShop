using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories_interface
{
    public interface IPaymentAccountRepository
    {
        Task CreateAsync(PaymentAccount paymentAccount);

        Task UpdateAsync(PaymentAccount paymentAccount);
        Task DeleteAsync(PaymentAccount paymentAccount);

        Task<PaymentAccount?> GetByIdAsync(int id);

        Task<PaymentAccount?> GetActiveAsync();
    }
}
