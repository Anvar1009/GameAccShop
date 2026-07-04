using Application.DTOs.OrderDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IAdminOrderService
    {
        Task<List<AdminOrderResponse>> GetOrdersAsync();

        Task<AdminOrderDetailsResponse> GetOrderDetailsAsync(int orderId);

        Task CancelOrderAsync(int orderId);

    }
}
