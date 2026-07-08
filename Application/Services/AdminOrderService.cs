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

            var order = await _orderRepository.GetByIdAsync(orderId)
                ?? throw new OrderNotFoundException();

            var buyer = order.Buyer;
            var seller = order.Seller;
            var product = order.Product;
            var payment = order.Payment;

            return new AdminOrderDetailsResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                Price = order.Price,
                CreatedAt = order.CreatedAt,

                BuyerId = order.BuyerId,
                BuyerName = $"{buyer?.FirstName} {buyer?.LastName}",
                BuyerPhone = buyer?.PhoneNumber ?? string.Empty,

                SellerId = order.SellerId,
                SellerName = $"{seller?.FirstName} {seller?.LastName}",
                SellerPhone = seller?.PhoneNumber ?? string.Empty,

                ProductId = order.ProductId,
                ProductDescription = product?.Description ?? string.Empty,
                AccStrength = product?.AccStrength ?? 0,
                PlayerCount = product?.PlayerCount ?? 0,
                CoinsCount = product?.CoinsCount ?? 0,
                Tags = product?.Tags.Select(t => t.Name).ToList() ?? new(),
                Medias = product?.Medias.Select(m => m.Url).ToList() ?? new(),

                PaymentStatus = payment?.Status ?? PaymentStatus.Pending,
                PaymentMethod = payment?.PaymentMethod ?? PaymentMethod.CardTransfer,
                PaymentAmount = payment?.Amount ?? 0,
                CardNumber = payment?.PaymentAccount?.AccountNumber ?? string.Empty,

                IsBuyerConfirmed = order.IsBuyerConfirmed,
                IsCompletedByAdmin = order.IsCompletedByAdmin,
                CompletedAt = order.CompletedAt
            };
        }

        public async Task<List<AdminOrderResponse>> GetOrdersAsync()
        {
            var orders = new List<AdminOrderResponse>();

            var orderEntities = await _orderRepository.GetOrders();

            if(orderEntities== null)
            {
                return orders;
            }

            foreach (var orderEntity in orderEntities)
            {
                AdminOrderResponse orderResponse = new AdminOrderResponse
                {
                    OrderId = orderEntity.Id,
                    Status = orderEntity.Status,
                    Price = orderEntity.Price,
                    CreatedAt = orderEntity.CreatedAt,
                    BuyerId = orderEntity.BuyerId,
                    BuyerName = orderEntity.Buyer?.FirstName,
                    SellerId = orderEntity.SellerId,
                    SellerName = orderEntity.Seller?.FirstName,
                    ProductId = orderEntity.ProductId,
                };

                orders.Add(orderResponse);

            }

            return orders;

        }
    }
}
