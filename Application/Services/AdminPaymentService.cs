using Application.DTOs.OrderDTO;
using Application.DTOs.PaymentDTO;
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
    public class AdminPaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public AdminPaymentService(IPaymentRepository paymentRepository, IOrderRepository orderRepository, IUnitOfWork unitOfWork, IProductRepository productRepository)
        {
            _paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }

        public async Task<PaymentDetailsResponse> GetPaymentDetailsAsync(int buyerId, int orderId)
        {
            
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) 
            {
                throw new OrderNotFoundException();
            }

            if (order.BuyerId != buyerId)
            {
                throw new ForbiddenException();
            }


            var payment = order.Payment;

            if(payment == null)
            {
                throw new PaymentNotFoundException();
            }

            return new PaymentDetailsResponse 
            {
                Amount = payment.Amount,
                CardNumber = payment.PaymentAccount.AccountNumber,
                Name = payment.PaymentAccount.Name,
                OwnerName = payment.PaymentAccount.OwnerName,
                PaymentMethod = payment.PaymentMethod,
                OrderId = orderId,
                PaymentId = payment.Id,
                Status= payment.Status
            };

        }


        public async Task<PaymentStatusResponse> GetPaymentStatusAsync(int buyerId, int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new OrderNotFoundException();
            }

            if (order.BuyerId != buyerId)
            {
                throw new ForbiddenException();
            }


            var payment = order.Payment;

            if (payment == null)   
            {
                throw new PaymentNotFoundException();
            }

            return new PaymentStatusResponse
            {
                PaymentId = payment.Id,
                Status = payment.Status,
                OrderStatus = order.Status,
                ConfirmedAt = payment.ConfirmedAt,
                ReleasedAt = payment.ReleasedAt
            };

        }

        public async Task UploadReceiptAsync(int buyerId, UploadReceiptRequest request)
        {
            var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);

            if (payment == null)
                throw new PaymentNotFoundException();

            var order = payment.Order;
      

            if (order == null)
            {
                throw new OrderNotFoundException();
            }

            // 2. Buyer tekshirish
            if (order.BuyerId != buyerId)
            {
                throw new ForbiddenException();
            }

            // 3. Order holatini tekshirish
            if (order.Status != OrderStatus.WaitingPayment)
            {
                throw new InvalidOperationException("Receipt cannot be uploaded for this order.");
            }


            // 5. Payment status tekshirish
            if (payment.Status != PaymentStatus.Pending)
            {
                throw new InvalidOperationException("Receipt has already been uploaded.");
            }

            // 6. Faylni tekshirish
            if (request.Receipt == null || request.Receipt.Length == 0)
            {
                throw new InvalidOperationException("Receipt file is required.");
            }

            var extension = Path.GetExtension(request.Receipt.FileName).ToLower();

            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".pdf" };

            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Only JPG, JPEG, PNG and PDF files are allowed.");
            }

            // 5 MB
            if (request.Receipt.Length > 5 * 1024 * 1024)
            {
                throw new InvalidOperationException("File size cannot exceed 5 MB.");
            }

            // 7. Papkani yaratish
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "receipts");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            // 8. Unikal fayl nomi
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            // 9. Faylni saqlash
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.Receipt.CopyToAsync(stream);
            }

            // 10. Database uchun URL
            payment.ReceiptUrl = $"/uploads/receipts/{fileName}";


            await _paymentRepository.UpdateAsync(payment);

            await _unitOfWork.SaveChangesAsync();
        }


        //  Admin Payment Service Methods

        public async Task<AdminPaymentDetailsResponse> GetPaymentDetailsAsync(int paymentId)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);

            if(payment == null)
            {
                throw new PaymentNotFoundException();
            }

            var order = payment.Order;
            if(order == null)
            {
                throw new OrderNotFoundException();
            }
            var buyer = order.Buyer;
            var seller = order.Seller;


            return new AdminPaymentDetailsResponse()
            {
                PaymentId = paymentId,
                AccountName = payment.PaymentAccount.Name,
                Amount = payment.Amount,
                BuyerId = buyer.Id,
                BuyerName = $"{buyer.FirstName} {buyer.LastName}",
                BuyerPhone = buyer.PhoneNumber,
                IsBuyerConfirmed = order.IsBuyerConfirmed,
                IsCompletedByAdmin = order.IsCompletedByAdmin,
                CanConfirmPayment = CanConfirmPayment(payment),
                CanReleasePayment = CanReleasePayment(order, payment),
                CardNumber = payment.PaymentAccount.AccountNumber,
                Coins = order.Product.CoinsCount,
                CreatedAt = payment.CreatedAt,
                ConfirmedAt = payment.ConfirmedAt,
                ReleasedAt = payment.ReleasedAt,
                Medias = order.Product.Medias.Select(m => m.Url).ToList(),
                OrderId = order.Id,
                OrderStatus = order.Status,
                OwnerName = payment.PaymentAccount.OwnerName,
                PaymentMethod = payment.PaymentMethod,
                PlayerCount = order.Product.PlayerCount,
                ProductDescription = order.Product.Description,
                ProductId = order.ProductId,
                ReceiptUrl = payment.ReceiptUrl,
                SellerId = order.SellerId,
                SellerName = $"{seller.FirstName} {seller.LastName}",
                SellerPhone = seller.PhoneNumber,
                Status = payment.Status,
                Strength = order.Product.AccStrength,
                Tags= order.Product.Tags.Select(t => t.Name).ToList()
            };


        }

        private bool CanConfirmPayment(Payment payment)
        {
            var order = payment.Order;
            if (order == null)
                return false;
            return order.Status == OrderStatus.WaitingPayment && payment.Status == PaymentStatus.Pending;
        }

        private bool CanReleasePayment(Order order, Payment payment)
        {
            if (order == null || payment == null)
                return false;
            return order.Status == OrderStatus.Completed && payment.Status == PaymentStatus.Confirmed;
        }


        public async Task<List<AdminPaymentResponse>> GetPaymentsAsync()
        {
            var payments = await _paymentRepository.GetAllAsync();

            return payments.Select(payment => new AdminPaymentResponse
            {
                PaymentId = payment.Id,
                OrderId = payment.OrderId,
                BuyerName = $"{payment.Order.Buyer.FirstName} {payment.Order.Buyer.LastName}",
                SellerName = $"{payment.Order.Seller.FirstName} {payment.Order.Seller.LastName}",
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
                CreatedAt = payment.CreatedAt
            }).ToList();
        }

        
        public Task ReleasePaymentAsync(int paymentId)
        {
            throw new NotImplementedException();
        }

        public async Task ConfirmPaymentAsync(int paymentId)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);

            if(payment == null)
            {
                throw new PaymentNotFoundException();
            }
            var order = payment.Order;
            var product = order.Product;

            if (payment.Status != PaymentStatus.Pending)
            {
                throw new InvalidOperationException("Payment has already been confirmed.");
            }

            if (order.Status != OrderStatus.WaitingPayment)
            {
                throw new InvalidOperationException("Order is not waiting for payment.");
            }

            await using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                payment.Status = PaymentStatus.Confirmed;
                product.Status = ProductStatus.Reserved;
                order.Status = OrderStatus.PaymentConfirmed;
                await _productRepository.UpdateAsync(product);
                await _paymentRepository.UpdateAsync(payment);
                await _orderRepository.UpdateAsync(order);
                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

        }

    }
}
