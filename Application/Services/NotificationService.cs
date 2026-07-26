using Application.DTOs.NotificationDTOs;
using Application.Interfaces.Notifications;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Application.Interfaces.UnitOfWorkFolder;
using Domain.Models.ChatModels;
using Domain.Models.OrdersModel;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    /// <summary>
    /// Buyurtma oqimidagi hodisalarni bildirishnomaga aylantiradi: bazaga yozadi
    /// va SignalR orqali qabul qiluvchining ekraniga yuboradi.
    ///
    /// Matnlar bazaga o'zbekcha saqlanadi va zaxira sifatida ishlaydi — front
    /// ularni NotificationType bo'yicha tanlangan tilga o'giradi.
    /// </summary>
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepositories _userRepositories;
        private readonly INotificationPublisher _publisher;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            INotificationRepository notificationRepository,
            IUserRepositories userRepositories,
            INotificationPublisher publisher,
            IUnitOfWork unitOfWork,
            ILogger<NotificationService> logger)
        {
            _notificationRepository = notificationRepository;
            _userRepositories = userRepositories;
            _publisher = publisher;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }


        public async Task<List<NotificationResponse>> GetMyNotificationsAsync(int userId)
        {
            var notifications = await _notificationRepository.GetByUseridAsync(userId);

            return notifications.Select(Map).ToList();
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _notificationRepository.GetUnreadCountAsync(userId);
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            await _notificationRepository.MarkAsReadAsync(userId);
        }


        public async Task NotifyNewOrderAsync(Order order)
        {
            await DispatchAsync(
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.NewOrder,
                    "Yangi buyurtma",
                    $"Akkauntingizga #{order.Id} raqamli yangi buyurtma tushdi. Xaridor to'lovni kutmoqda.",
                    order.Id));
        }

        public async Task NotifyPaymentUploadedAsync(Order order)
        {
            var admins = await BuildForAdminsAsync(
                NotificationType.PaymentUploaded,
                "To'lov cheki yuklandi",
                $"#{order.Id} raqamli buyurtma uchun xaridor to'lov chekini yukladi. Tekshirish kerak.",
                order.Id);

            await DispatchAsync(admins.ToArray());
        }

        public async Task NotifyPaymentConfirmedAsync(Order order)
        {
            await DispatchAsync(
                Build(order.BuyerId,
                    NotificationAudience.Buyer,
                    NotificationType.PaymentConfirmed,
                    "To'lovingiz tasdiqlandi",
                    $"#{order.Id} raqamli buyurtma to'lovi tasdiqlandi. Sotuvchi akkauntni topshiradi.",
                    order.Id),
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.PaymentConfirmed,
                    "To'lov tasdiqlandi",
                    $"#{order.Id} raqamli buyurtma to'lovi tasdiqlandi. Akkauntni xaridorga topshiring.",
                    order.Id));
        }

        public async Task NotifyBuyerConfirmedAsync(Order order)
        {
            var recipients = new List<Notification>
            {
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.BuyerConfirmed,
                    "Xaridor qabul qildi",
                    $"#{order.Id} raqamli buyurtmani xaridor tasdiqladi. To'lov chiqarilishini kuting.",
                    order.Id)
            };

            recipients.AddRange(await BuildForAdminsAsync(
                NotificationType.BuyerConfirmed,
                "Xaridor buyurtmani tasdiqladi",
                $"#{order.Id} raqamli buyurtmani xaridor tasdiqladi. To'lovni sotuvchiga chiqarish mumkin.",
                order.Id));

            await DispatchAsync(recipients.ToArray());
        }

        public async Task NotifyPaymentReleasedAsync(Order order)
        {
            await DispatchAsync(
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.PaymentReleased,
                    "To'lov chiqarildi",
                    $"#{order.Id} raqamli buyurtma bo'yicha to'lov sizga chiqarildi.",
                    order.Id),
                Build(order.BuyerId,
                    NotificationAudience.Buyer,
                    NotificationType.PaymentReleased,
                    "Buyurtma yakunlandi",
                    $"#{order.Id} raqamli buyurtma yakunlandi. Xaridingiz uchun rahmat!",
                    order.Id));
        }


        public async Task NotifyDisputeOpenedAsync(Dispute dispute)
        {
            var admins = await BuildForAdminsAsync(
                NotificationType.DisputeOpened,
                "Yangi dispute ochildi",
                $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute ochildi. Sababi: {dispute.Reason}",
                dispute.OrderId);

            await DispatchAsync(admins.ToArray());
        }

        public async Task NotifyDisputeUnderReviewAsync(Dispute dispute)
        {
            var order = dispute.Order;

            await DispatchAsync(
                Build(order.BuyerId,
                    NotificationAudience.Buyer,
                    NotificationType.DisputeUnderReview,
                    "Dispute ko'rib chiqilmoqda",
                    $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute admin tomonidan ko'rib chiqilmoqda.",
                    dispute.OrderId),
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.DisputeUnderReview,
                    "Dispute ko'rib chiqilmoqda",
                    $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute admin tomonidan ko'rib chiqilmoqda.",
                    dispute.OrderId));
        }

        public async Task NotifyDisputeEvidenceRequestedAsync(Dispute dispute)
        {
            var order = dispute.Order;

            await DispatchAsync(
                Build(order.BuyerId,
                    NotificationAudience.Buyer,
                    NotificationType.DisputeEvidenceRequested,
                    "Qo'shimcha isbot talab qilinmoqda",
                    $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute uchun admin qo'shimcha isbot so'ramoqda.",
                    dispute.OrderId),
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.DisputeEvidenceRequested,
                    "Qo'shimcha isbot talab qilinmoqda",
                    $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute uchun admin qo'shimcha isbot so'ramoqda.",
                    dispute.OrderId));
        }

        public async Task NotifyDisputeResolvedAsync(Dispute dispute)
        {
            var order = dispute.Order;

            var resolvedInFavorOfBuyer = dispute.Status == DisputeStatus.ResolvedBuyer;

            var buyerMessage = resolvedInFavorOfBuyer
                ? $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute siz foydangizga hal qilindi."
                : $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute sotuvchi foydasiga hal qilindi.";

            var sellerMessage = resolvedInFavorOfBuyer
                ? $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute xaridor foydasiga hal qilindi."
                : $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute siz foydangizga hal qilindi.";

            await DispatchAsync(
                Build(order.BuyerId,
                    NotificationAudience.Buyer,
                    NotificationType.DisputeResolved,
                    "Dispute hal qilindi",
                    buyerMessage,
                    dispute.OrderId),
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.DisputeResolved,
                    "Dispute hal qilindi",
                    sellerMessage,
                    dispute.OrderId));
        }

        public async Task NotifyDisputeClosedAsync(Dispute dispute)
        {
            var order = dispute.Order;

            await DispatchAsync(
                Build(order.BuyerId,
                    NotificationAudience.Buyer,
                    NotificationType.DisputeClosed,
                    "Dispute yopildi",
                    $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute yopildi.",
                    dispute.OrderId),
                Build(order.SellerId,
                    NotificationAudience.Seller,
                    NotificationType.DisputeClosed,
                    "Dispute yopildi",
                    $"#{dispute.OrderId} raqamli buyurtma bo'yicha dispute yopildi.",
                    dispute.OrderId));
        }


        public async Task NotifyDisputeEvidenceUploadedAsync(Dispute dispute, int uploadedById)
        {
            var order = dispute.Order;
            var uploaderLabel = uploadedById == order.BuyerId ? "Xaridor" : "Sotuvchi";

            var admins = await BuildForAdminsAsync(
                NotificationType.DisputeEvidenceUploaded,
                "Isbot yuklandi",
                $"{uploaderLabel} #{dispute.OrderId} raqamli buyurtma dispute'i uchun isbot yukladi.",
                dispute.OrderId);

            await DispatchAsync(admins.ToArray());
        }


        private static Notification Build(
            int userId,
            NotificationAudience audience,
            NotificationType type,
            string title,
            string message,
            int? orderId) => new Notification
            {
                userId = userId,
                Audience = audience,
                notificationType = type,
                Title = title,
                Message = message,
                OrderId = orderId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

        private async Task<List<Notification>> BuildForAdminsAsync(
            NotificationType type,
            string title,
            string message,
            int? orderId)
        {
            var admins = await _userRepositories.GetAdminsAsync();

            return admins
                .Select(a => Build(a.Id, NotificationAudience.Admin, type, title, message, orderId))
                .ToList();
        }

        /// <summary>
        /// Bildirishnomalarni bir SaveChanges'da yozadi (Id shu yerda beriladi),
        /// so'ng har birini egasiga uzatadi.
        ///
        /// Chaqiruvchilar buni tranzaksiya commit bo'lgandan keyin ishlatadi, va
        /// bildirishnoma yordamchi narsa — bu yerdagi xato buyurtmani ham, to'lovni
        /// ham buzmasligi kerak, shuning uchun log qilinadi va yutiladi.
        /// </summary>
        private async Task DispatchAsync(params Notification[] notifications)
        {
            if (notifications.Length == 0)
                return;

            try
            {
                foreach (var notification in notifications)
                {
                    await _notificationRepository.CreateAsync(notification);
                }

                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bildirishnomalarni saqlab bo'lmadi.");
                return;
            }

            foreach (var notification in notifications)
            {
                try
                {
                    await _publisher.PublishAsync(notification.userId, Map(notification));
                }
                catch (Exception ex)
                {
                    // Baza — asosiy manba: foydalanuvchi sahifani yangilaganda
                    // bildirishnomani baribir ko'radi.
                    _logger.LogWarning(ex,
                        "Bildirishnoma {NotificationId} foydalanuvchi {UserId} ga real vaqtda yetkazilmadi.",
                        notification.Id, notification.userId);
                }
            }
        }

        private static NotificationResponse Map(Notification notification) => new NotificationResponse
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            NotificationType = notification.notificationType,
            Audience = notification.Audience,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt,
            OrderId = notification.OrderId
        };
    }
}
