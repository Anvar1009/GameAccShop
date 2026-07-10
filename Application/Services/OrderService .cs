using Application.DTOs.OrderDTO;
using Application.Exceptions;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Application.Interfaces.UnitOfWorkFolder;
using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
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


        /// <summary>
        /// This Transaction is used to cancel an order. 
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="buyerid"></param>
        /// <returns></returns>
        /// <exception cref="OrderNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="ProductNotFoundException"></exception>
        public async Task CancelOrderAsync(int orderId , int buyerid)
        {
             
            var result = await _orderRepository.GetByIdAsync(orderId);

            if (result == null)
            {
                throw new OrderNotFoundException();
            }

            if(buyerid != result.BuyerId)
            {
                throw new InvalidOperationException("You cannot cancel this order.");
            }

            if (result.Status != OrderStatus.WaitingPayment)
            {
                throw new InvalidOperationException("You cannot cancel this order.");
            }


            var product = await _productRepository.GetByIdAsync(result.ProductId);
            if (product == null)
            {
                throw new ProductNotFoundException();
            }

            var payment = await _paymentRepository.GetByOrderIdAsync(orderId);
            if(payment == null)
            {
                throw new InvalidOperationException();
            }

            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                result.Status = OrderStatus.Cancelled;
                product.Status = ProductStatus.Active;
                payment.Status = PaymentStatus.Cancelled;
                await _orderRepository.UpdateAsync(result);
                await _productRepository.UpdateAsync(product);
                await _paymentRepository.UpdateAsync(payment);
                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

        }




        /// <summary>
        /// This Transaction is used to confirm an order.
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="buyerId"></param>
        /// <returns></returns>
        /// <exception cref="OrderNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="ProductNotFoundException"></exception>
        public async Task ConfirmOrderAsync(int orderId, int buyerId)
        {

            var result = await _orderRepository.GetByIdAsync(orderId);

            if (result == null)
            {
                throw new OrderNotFoundException();
            }

            if (buyerId != result.BuyerId)
            {
                throw new InvalidOperationException("You cannot confirm this order.");
            }

            if (result.Status != OrderStatus.TransferInProgress &&
                result.Status != OrderStatus.PaymentConfirmed)
            {
                throw new InvalidOperationException("You cannot confirm this order.");
            }
            var product =  result.Product;
            if (product == null)
            {
                throw new ProductNotFoundException();
            }


            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                result.IsBuyerConfirmed = true;
                result.Status = OrderStatus.BuyerConfirmed;
                product.Status = ProductStatus.Sold;
                await _orderRepository.UpdateAsync(result);
                await _productRepository.UpdateAsync(product);
                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }



        /// <summary>
        /// This Transaction is used to create an order. 
        /// It checks if the product is available, creates an order and payment, 
        /// and updates the product status to reserved.
        /// </summary>
        /// <param name="buyerId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="ProductNotFoundException"></exception>
        /// <exception cref="PaymentAccountNotFoundException"></exception>
        public async Task<OrderResponse> CreateOrderAsync(int buyerId, CreateOrderRequest request)
        {
                 var result = await _productRepository.GetByIdAsync(request.ProductId);

            if (result == null)
            {
                throw new ProductNotFoundException();
            }

            var product = await ValidateProductAsync(result,buyerId);
            


            var order =  CreateOrder(buyerId, product);

            var paymentAccount = await _paymentAccountRepository.GetActiveAsync();

            if (paymentAccount == null)
            {
                throw new PaymentAccountNotFoundException();
            }

            var payment = CreatePayment( order, paymentAccount);


            await using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                await _orderRepository.CreateAsync(order);
                await _paymentRepository.CreateAsync(payment);
                product.Status = ProductStatus.Reserved;
                await _productRepository.UpdateAsync(product);
                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            OrderResponse orderResponse = new OrderResponse()
            {
                OrderId = order.Id,
                ProductId = product.Id,
                Price = order.Price,
                Status = order.Status,
                PaymentStatus = payment.Status,
                PaymentRequired = true,
                CreatedAt = order.CreatedAt
            };

            return orderResponse;
        }




        private  Order CreateOrder(int buyerId, Product product)
        {
            var order = new Order
            {
                BuyerId = buyerId,
                SellerId = product.SellerId,
                ProductId = product.Id,
                Price = product.AccPrice,
                Status = OrderStatus.WaitingPayment,
                IsBuyerConfirmed = false,
                CreatedAt = DateTime.UtcNow
            };

            return order;
        }


        private Payment CreatePayment(Order order, PaymentAccount paymentAccount)
        {
            var payment = new Payment
            {
                Order = order,
                PaymentAccountId = paymentAccount.Id,
                Amount = order.Price,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            return payment;
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

        public async Task<List<BuyerOrderResponse>> GetBuyerOrdersAsync(int buyerId)
        {
            var orders = await _orderRepository.GetBuyerOrders(buyerId);

            var responses = new List<BuyerOrderResponse>();

            foreach (var order in orders)
            {
                responses.Add(new BuyerOrderResponse
                {
                    OrderId=order.Id,
                    ProductId=order.ProductId,
                    ProductTitle= order.Product.AccStrength+" "+order.Product.CoinsCount,
                    SellerName = $"{order.Seller.FirstName} {order.Seller.LastName}",
                    ProductDescription = order.Product.Description,
                    Status = order.Status,
                    Price = order.Price,
                    SellerId = order.SellerId,
                    PaymentStatus = order.Payment.Status,
                    CreatedAt= order.CreatedAt,
                    Tags = order.Product.Tags.Select(t => t.Name).ToList(),
                    Medias = order.Product.Medias.Select(m => m.Url).ToList()
                });
            }

            return responses;
        }

      

        public async Task<List<SellerOrderResponse>> GetSellerOrdersAsync(int sellerId)
        {
            var orders = await _orderRepository.GetSellerOrders(sellerId);
            var responses = new List<SellerOrderResponse>();
            foreach(var order in orders)
            {
                responses.Add(new SellerOrderResponse
                {
                    OrderId = order.Id,
                    ProductId = order.ProductId,
                    ProductImage = order.Product.Medias.FirstOrDefault()?.Url,
                    ProductTitle = order.Product.Description,
                    Price = order.Price,
                    BuyerId = order.BuyerId,
                    BuyerName = $"{order.Buyer.FirstName} {order.Buyer.LastName}",
                    Status = order.Status,
                    PaymentStatus = order.Payment.Status,
                    CreatedAt = order.CreatedAt,
                    CanOpenChat = CanOpenChat(order), // Implement logic to determine if chat can be opened
                    CanOpenDispute = CanOpenDispute(order) // Implement logic to determine if dispute can be opened
                });
            }

            return responses;
        }

        private bool CanOpenChat(Order order)
        {
            return order.Status == OrderStatus.PaymentConfirmed ||
                   order.Status == OrderStatus.TransferInProgress ||
                   order.Status == OrderStatus.BuyerConfirmed;
        }

        private bool CanOpenDispute(Order order)
        {
            return order.Status != OrderStatus.Completed &&
                   order.Status != OrderStatus.Cancelled;
        }

        public async Task<BuyerOrderDetailsResponse> GetBuyerOrderDetailsAsync(int buyerId, int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                throw new OrderNotFoundException ();
            }

            if(order.BuyerId != buyerId)
            {
                throw new UnauthorizedAccessException("You are not authorized to view this order.");
            }

            BuyerOrderDetailsResponse response = new BuyerOrderDetailsResponse()
            {
                OrderId = order.Id,
                ProductId = order.Product.Id,
                Tags = order.Product.Tags.Select(t => t.Name).ToList(),
                Medias = order.Product.Medias.Select(m => m.Url).ToList(),
                ProductTitle = order.Product.Description,
                ProductDescription = order.Product.Description,
                Price = order.Price,
                SellerId = order.SellerId,
                SellerName = $"{order.Seller.FirstName} {order.Seller.LastName}",
                SellerPhone = order.Seller.PhoneNumber,
                Status = order.Status,
                PaymentStatus = order.Payment.Status,
                PaymentMethod = order.Payment.PaymentMethod,
                CreatedAt = order.CreatedAt,
                CanConfirmOrder = CanConfirmOrder(order),
                CanCancelOrder = CanCancelOrder(order),
                CanOpenChat = CanOpenChat(order),
                CanOpenDispute = CanOpenDispute(order)
            };

            return response;
        }

        public async Task<SellerOrderDetailsResponse> GetSellerOrderDetailsAsync(int sellerId, int orderId)
        {
            var sellerOrder = await _orderRepository.GetByIdAsync(orderId);

            if(sellerOrder == null)
            {
                throw new OrderNotFoundException();
            }
            if(sellerOrder.SellerId != sellerId)
            {
                throw new UnauthorizedAccessException("You are not authorized to view this order.");
            }

            SellerOrderDetailsResponse response = new SellerOrderDetailsResponse()
            {
                OrderId = sellerOrder.Id,
                ProductId = sellerOrder.Product.Id,
                Tags = sellerOrder.Product.Tags.Select(t => t.Name).ToList(),
                Medias = sellerOrder.Product.Medias.Select(m => m.Url).ToList(),
                ProductTitle = sellerOrder.Product.Description,
                ProductDescription = sellerOrder.Product.Description,
                Price = sellerOrder.Price,
                BuyerId = sellerOrder.BuyerId,
                BuyerName = $"{sellerOrder.Buyer.FirstName} {sellerOrder.Buyer.LastName}",
                BuyerPhone = sellerOrder.Buyer.PhoneNumber,
                Status = sellerOrder.Status,
                PaymentStatus = sellerOrder.Payment.Status,
                PaymentMethod = sellerOrder.Payment.PaymentMethod,
                CreatedAt = sellerOrder.CreatedAt,
                CanOpenChat = CanOpenChat(sellerOrder),
                CanOpenDispute = CanOpenDispute(sellerOrder)
            };

            return response;
        }

        private bool CanConfirmOrder(Order order)
        {
            return order.Status == OrderStatus.PaymentConfirmed
                || order.Status == OrderStatus.TransferInProgress;
        }

        private bool CanCancelOrder(Order order)
        {
            return  order.Status == OrderStatus.WaitingPayment;
        }
    }
}
