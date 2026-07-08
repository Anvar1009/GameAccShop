using Application.DTOs.OrderDTO;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AdminOrderService : IAdminOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public AdminOrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;            
        }


        public async Task<AdminOrderDetailsResponse> GetOrderDetailsAsync(int orderId)
        {
            if (orderId <= 0)
            {
                throw new ArgumentException("Order ID must be greater than zero.", nameof(orderId));
            }

            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {orderId} not found.");
            }

            return new AdminOrderDetailsResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                Price = order.Price,
                CreatedAt = order.CreatedAt,
                BuyerId = order.BuyerId,
                BuyerName = order.Buyer?.FirstName,
                BuyerPhone = order.Buyer?.PhoneNumber,
                SellerId = order.SellerId,
                SellerName = order.Seller?.FirstName,
                SellerPhone = order.Seller?.PhoneNumber,
                ProductId = order.ProductId,
                ProductDescription = order.Product?.Description,
                AccStrength = order.Product?.AccStrength ?? 0,
                PlayerCount = order.Product?.PlayerCount ?? 0,
                CoinsCount = order.Product?.CoinsCount ?? 0,
                Tags = order.Product?.Tags.Select(t => t.Name).ToList() ?? new List<string>(),
                Medias = order.Product?.Medias.Select(m => m.Url).ToList() ?? new List<string>(),
                PaymentStatus = order.Payment?.Status ?? PaymentStatus.Pending,
                PaymentMethod = order.Payment?.PaymentMethod ?? PaymentMethod.CardTransfer,
                PaymentAmount = order.Payment?.Amount ?? 0m,
                CardNumber = order.Payment?.PaymentAccount.AccountNumber,
                IsBuyerConfirmed = order.IsBuyerConfirmed,
                IsCompletedByAdmin = order.IsCompletedByAdmin,
                CompletedAt = order.CompletedAt,
            };  


        }

        public async Task<List<AdminOrderResponse>> GetOrdersAsync()
        {
            var orders = new List<AdminOrderResponse>();

            var orderEntities = await _orderRepository.GetByIdAsync();
        }
    }
}
