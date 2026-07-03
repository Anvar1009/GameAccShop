using Application.DTOs.OrderDTO;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Application.Interfaces.UnitOfWorkFolder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IPaymentAccountRepository _paymentAccountRepository;
        private readonly IUserRepositories _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            IPaymentRepository paymentRepository,
            IPaymentAccountRepository paymentAccountRepository,
            IUnitOfWork unitOfWork)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _paymentRepository = paymentRepository;
            _paymentAccountRepository = paymentAccountRepository;
            _unitOfWork = unitOfWork;
        }

        public Task CancelOrderAsync(int orderId)
        {
            throw new NotImplementedException();
        }

        public Task ConfirmOrderAsync(int orderId)
        {
            throw new NotImplementedException();
        }

        public Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<List<BuyerOrderResponse>> GetBuyerOrdersAsync(int buyerId)
        {
            throw new NotImplementedException();
        }

        public Task<OrderDetailsResponse> GetByIdAsync(int orderId)
        {
            throw new NotImplementedException();
        }

        public Task<List<SellerOrderResponse>> GetSellerOrdersAsync(int sellerId)
        {
            throw new NotImplementedException();
        }
    }
}
