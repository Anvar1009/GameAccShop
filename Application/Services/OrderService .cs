using Application.DTOs.OrderDTO;
using Application.Exceptions;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Application.Interfaces.UnitOfWorkFolder;
using Domain.Models.ProductsModels;
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



        public async Task<OrderResponse> CreateOrderAsync(int buyerId, CreateOrderRequest request)
        {
            var result = await _productRepository.GetByIdAsync(request.ProductId);

            if (result == null)
            {
                throw new ProductNotFoundException();
            }

            var product = await ValidateProductAsync(result,buyerId);

        }



        private async Task<Product> ValidateProductAsync(Product product , int id)
        {

            if(product.Status != Domain.Models.ProductsModels.ProductStatus.Active ||
                product.Status == Domain.Models.ProductsModels.ProductStatus.Reserved)
            {
                throw new ProductNotAvailableException();
            }

            if(product.SellerId == id)
            {
                throw new InvalidOperationException("You cannot buy your own product.");
            }

            var paymentAccount = await _paymentAccountRepository.GetActiveAsync();

            if (paymentAccount == null)
            {
                throw new Exception("No active payment account found.");
            }
            return product;
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
