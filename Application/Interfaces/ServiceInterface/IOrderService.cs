using Application.DTOs.OrderDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IOrderService
    {
        Task<OrderResponse> CreateOrderAsync(int BuyerId, CreateOrderRequest request);       

        Task<List<BuyerOrderResponse>> GetBuyerOrdersAsync(int buyerId);

        Task<List<SellerOrderResponse>> GetSellerOrdersAsync(int sellerId);

        Task<BuyerOrderDetailsResponse> GetBuyerOrderDetailsAsync(int buyerId);

        Task<SellerOrderDetailsResponse> GetSellerOrderDetailsAsync(int sellerId);

        Task CancelOrderAsync(int orderId);

        Task ConfirmOrderAsync(int orderId);
    }
}
