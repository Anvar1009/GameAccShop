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

        Task<BuyerOrderDetailsResponse> GetBuyerOrderDetailsAsync(int buyerId, int orderId);

        Task<SellerOrderDetailsResponse> GetSellerOrderDetailsAsync(int sellerId, int orderId);

        Task CancelOrderAsync(int orderId, int buyerId);

        Task ConfirmOrderAsync(int orderId, int buyerId);
    }
}
