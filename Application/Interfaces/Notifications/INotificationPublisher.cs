using Application.DTOs.NotificationDTOs;
using System.Threading.Tasks;

namespace Application.Interfaces.Notifications
{
    /// <summary>
    /// Bildirishnomani foydalanuvchiga real vaqtda yetkazadi. Hub API loyihasida
    /// yashaydi, shuning uchun Application qatlami shu abstraksiya orqali gaplashadi
    /// (implementatsiya: GameAccShop/Notifications/SignalRNotificationPublisher).
    /// </summary>
    public interface INotificationPublisher
    {
        Task PublishAsync(int userId, NotificationResponse notification);
    }
}
