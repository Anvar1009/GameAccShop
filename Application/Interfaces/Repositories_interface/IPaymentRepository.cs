using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories_interface
{
    public interface IPaymentRepository
    {
        Task CreateAsync(Payment payment);

        Task UpdateAsync(Payment payment);

        Task<List<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);

        Task<Payment?> GetDetailsAsync(int id);

        Task<Payment?> GetByOrderIdAsync(int orderId);
    }
}
