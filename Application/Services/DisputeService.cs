using Application.DTOs.DisputeDTO;
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
    public class DisputeService : IDisputeService
    {
        private readonly IDisputeRepository _disputeRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public DisputeService(
            IDisputeRepository disputeRepository,
            IOrderRepository orderRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _disputeRepository = disputeRepository;
            _orderRepository = orderRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }


        /// <summary>
        /// This Transaction is used to open a dispute for an order.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="OrderNotFoundException"></exception>
        /// <exception cref="ForbiddenException"></exception>
        /// <exception cref="BadRequestException"></exception>
        /// <exception cref="DisputeAlreadyExistsException"></exception>
        public async Task<DisputeResponse> OpenDisputeAsync(int userId, OpenDisputeRequest request)
        {
            var order = await _orderRepository.GetByIdAsync(request.OrderId)
                ?? throw new OrderNotFoundException();

            if (userId != order.BuyerId && userId != order.SellerId)
            {
                throw new ForbiddenException();
            }

            if (order.Status == OrderStatus.Completed || order.Status == OrderStatus.Cancelled)
            {
                throw new BadRequestException("You cannot open a dispute for this order.");
            }

            if (string.IsNullOrWhiteSpace(request.Reason))
            {
                throw new BadRequestException("Reason is required.");
            }

            if (await _disputeRepository.ExistsOpenDisputeAsync(order.Id))
            {
                throw new DisputeAlreadyExistsException();
            }

            var dispute = new Dispute
            {
                OrderId = order.Id,
                OpenedById = userId,
                Reason = request.Reason,
                Status = DisputeStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                await _disputeRepository.CreateAsync(dispute);

                order.Status = OrderStatus.Disputed;
                await _orderRepository.UpdateAsync(order);

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            // dispute.Id faqat commit'dan keyin mavjud.
            await _notificationService.NotifyDisputeOpenedAsync(dispute);

            return MapToResponse(dispute, order);
        }


        public async Task<List<DisputeListResponse>> GetMyDisputesAsync(int userId)
        {
            var disputes = await _disputeRepository.GetByUserIdAsync(userId);

            return disputes.Select(MapToListResponse).ToList();
        }


        /// <exception cref="DisputeNotFoundException"></exception>
        /// <exception cref="ForbiddenException"></exception>
        public async Task<DisputeResponse> GetDisputeByIdAsync(int disputeId, int userId, bool isAdmin)
        {
            var dispute = await _disputeRepository.GetByIdAsync(disputeId)
                ?? throw new DisputeNotFoundException();

            if (!isAdmin && userId != dispute.Order.BuyerId && userId != dispute.Order.SellerId)
            {
                throw new ForbiddenException();
            }

            return MapToResponse(dispute, dispute.Order);
        }


        // ── Admin ────────────────────────────────────────────────────────

        public async Task<List<DisputeListResponse>> GetAllDisputesAsync()
        {
            var disputes = await _disputeRepository.GetAllAsync();

            return disputes.Select(MapToListResponse).ToList();
        }


        /// <exception cref="DisputeNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task StartReviewAsync(int disputeId)
        {
            var dispute = await _disputeRepository.GetByIdAsync(disputeId)
                ?? throw new DisputeNotFoundException();

            EnsureNotFinal(dispute);

            dispute.Status = DisputeStatus.UnderReview;
            await _disputeRepository.UpdateAsync(dispute);

            await _notificationService.NotifyDisputeUnderReviewAsync(dispute);
        }


        /// <exception cref="DisputeNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task RequestEvidenceAsync(int disputeId)
        {
            var dispute = await _disputeRepository.GetByIdAsync(disputeId)
                ?? throw new DisputeNotFoundException();

            EnsureNotFinal(dispute);

            dispute.Status = DisputeStatus.WaitingEvidence;
            await _disputeRepository.UpdateAsync(dispute);

            await _notificationService.NotifyDisputeEvidenceRequestedAsync(dispute);
        }


        /// <summary>
        /// Resolves the dispute in favor of the buyer: the order is cancelled,
        /// the product is freed up for resale, and the payment is cancelled
        /// unless it has already been released.
        /// </summary>
        /// <exception cref="DisputeNotFoundException"></exception>
        /// <exception cref="OrderNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task ResolveBuyerAsync(int disputeId, ResolveDisputeRequest request)
        {
            var dispute = await _disputeRepository.GetByIdAsync(disputeId)
                ?? throw new DisputeNotFoundException();

            EnsureNotFinal(dispute);

            var order = await _orderRepository.GetByIdAsync(dispute.OrderId)
                ?? throw new OrderNotFoundException();

            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                dispute.Status = DisputeStatus.ResolvedBuyer;
                dispute.AdminComment = request.AdminComment;
                dispute.ResolvedAt = DateTime.UtcNow;
                await _disputeRepository.UpdateAsync(dispute);

                order.Status = OrderStatus.Cancelled;

                var product = order.Product;
                if (product != null)
                {
                    product.Status = ProductStatus.Active;
                }

                var payment = order.Payment;
                if (payment != null &&
                    payment.Status != PaymentStatus.Released &&
                    payment.Status != PaymentStatus.Cancelled)
                {
                    payment.Status = PaymentStatus.Cancelled;
                }

                // Order graphidagi Product va Payment shu bitta chaqiruv bilan
                // saqlanadi — CancelOrderAsync'dagi kabi.
                await _orderRepository.UpdateAsync(order);

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            await _notificationService.NotifyDisputeResolvedAsync(dispute);
        }


        /// <summary>
        /// Resolves the dispute in favor of the seller: the order is completed
        /// by the admin, the product is marked sold, and the payment is
        /// released if it was confirmed.
        /// </summary>
        /// <exception cref="DisputeNotFoundException"></exception>
        /// <exception cref="OrderNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task ResolveSellerAsync(int disputeId, ResolveDisputeRequest request)
        {
            var dispute = await _disputeRepository.GetByIdAsync(disputeId)
                ?? throw new DisputeNotFoundException();

            EnsureNotFinal(dispute);

            var order = await _orderRepository.GetByIdAsync(dispute.OrderId)
                ?? throw new OrderNotFoundException();

            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                dispute.Status = DisputeStatus.ResolvedSeller;
                dispute.AdminComment = request.AdminComment;
                dispute.ResolvedAt = DateTime.UtcNow;
                await _disputeRepository.UpdateAsync(dispute);

                order.Status = OrderStatus.Completed;
                order.IsCompletedByAdmin = true;
                order.CompletedAt = DateTime.UtcNow;

                var product = order.Product;
                if (product != null)
                {
                    product.Status = ProductStatus.Sold;
                }

                var payment = order.Payment;
                if (payment != null && payment.Status == PaymentStatus.Confirmed)
                {
                    payment.Status = PaymentStatus.Released;
                    payment.ReleasedAt = DateTime.UtcNow;
                }

                await _orderRepository.UpdateAsync(order);

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            await _notificationService.NotifyDisputeResolvedAsync(dispute);
        }


        /// <exception cref="DisputeNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task CloseAsync(int disputeId)
        {
            var dispute = await _disputeRepository.GetByIdAsync(disputeId)
                ?? throw new DisputeNotFoundException();

            if (dispute.Status == DisputeStatus.Closed)
            {
                throw new InvalidOperationException("This dispute has already been closed.");
            }

            dispute.Status = DisputeStatus.Closed;
            await _disputeRepository.UpdateAsync(dispute);

            await _notificationService.NotifyDisputeClosedAsync(dispute);
        }


        private static void EnsureNotFinal(Dispute dispute)
        {
            if (dispute.Status == DisputeStatus.ResolvedBuyer ||
                dispute.Status == DisputeStatus.ResolvedSeller ||
                dispute.Status == DisputeStatus.Closed)
            {
                throw new InvalidOperationException("This dispute has already been resolved.");
            }
        }

        private static DisputeResponse MapToResponse(Dispute dispute, Order order) => new DisputeResponse
        {
            Id = dispute.Id,
            OrderId = dispute.OrderId,
            OrderStatus = order.Status,
            ProductId = order.ProductId,
            ProductDescription = order.Product?.Description ?? string.Empty,
            BuyerId = order.BuyerId,
            BuyerName = $"{order.Buyer?.FirstName} {order.Buyer?.LastName}",
            SellerId = order.SellerId,
            SellerName = $"{order.Seller?.FirstName} {order.Seller?.LastName}",
            OpenedById = dispute.OpenedById,
            OpenedByName = dispute.OpenedById == order.BuyerId
                ? $"{order.Buyer?.FirstName} {order.Buyer?.LastName}"
                : $"{order.Seller?.FirstName} {order.Seller?.LastName}",
            Reason = dispute.Reason,
            AdminComment = dispute.AdminComment,
            Status = dispute.Status,
            CreatedAt = dispute.CreatedAt,
            ResolvedAt = dispute.ResolvedAt
        };

        private static DisputeListResponse MapToListResponse(Dispute dispute) => new DisputeListResponse
        {
            Id = dispute.Id,
            OrderId = dispute.OrderId,
            OpenedById = dispute.OpenedById,
            OpenedByName = $"{dispute.OpenedBy?.FirstName} {dispute.OpenedBy?.LastName}",
            Reason = dispute.Reason,
            Status = dispute.Status,
            CreatedAt = dispute.CreatedAt
        };
    }
}
