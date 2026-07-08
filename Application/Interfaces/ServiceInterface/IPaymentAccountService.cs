using Application.DTOs.OrderDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IPaymentAccountService
    {
        Task CreateAsync(CreateRequestPaymentAccount request);
        Task UpdateAsync(int PayAccountId, CreateRequestPaymentAccount request);

        Task DeleteAsync(int PayAccountId);    
        Task<ResponsePaymentAccount?> GetActiveAsync();

        Task<ResponsePaymentAccount?> GetByIdAsync(int PayAccountId);

    }
}
