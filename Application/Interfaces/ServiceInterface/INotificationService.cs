using Application.DTOs.NotificationDTOs;
using Domain.Models.OrdersModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface INotificationService
    {
        // ── O'qish tomoni (NotificationController) ──────────────────────────
        Task<List<NotificationResponse>> GetMyNotificationsAsync(int userId);

        Task<int> GetUnreadCountAsync(int userId);

        Task MarkAllAsReadAsync(int userId);

        // ── Yozish tomoni: NotificationType dagi har bir bosqich ────────────
        // Har bir metod buyurtma oqimidagi bitta hodisaga mos keladi va uni
        // kim ko'rishi kerak bo'lsa o'shanga yuboradi.

        /// <summary>Xaridor buyurtma berdi → sotuvchiga.</summary>
        Task NotifyNewOrderAsync(Order order);

        /// <summary>Xaridor to'lov chekini yukladi → adminlarga.</summary>
        Task NotifyPaymentUploadedAsync(Order order);

        /// <summary>Admin to'lovni tasdiqladi → xaridor va sotuvchiga.</summary>
        Task NotifyPaymentConfirmedAsync(Order order);

        /// <summary>Xaridor akkauntni qabul qildi → sotuvchi va adminlarga.</summary>
        Task NotifyBuyerConfirmedAsync(Order order);

        /// <summary>Admin pulni sotuvchiga chiqardi → sotuvchi va xaridorga.</summary>
        Task NotifyPaymentReleasedAsync(Order order);

        /// <summary>Buyer yoki Seller dispute ochdi → adminlarga.</summary>
        Task NotifyDisputeOpenedAsync(Dispute dispute);

        /// <summary>Admin dispute'ni ko'rib chiqishni boshladi → buyer va sellerga.</summary>
        Task NotifyDisputeUnderReviewAsync(Dispute dispute);

        /// <summary>Admin qo'shimcha isbot so'radi → buyer va sellerga.</summary>
        Task NotifyDisputeEvidenceRequestedAsync(Dispute dispute);

        /// <summary>Admin dispute'ni hal qildi → buyer va sellerga.</summary>
        Task NotifyDisputeResolvedAsync(Dispute dispute);

        /// <summary>Admin dispute'ni yopdi → buyer va sellerga.</summary>
        Task NotifyDisputeClosedAsync(Dispute dispute);
    }
}
