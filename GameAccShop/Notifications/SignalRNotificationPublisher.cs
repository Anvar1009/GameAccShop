using Application.DTOs.NotificationDTOs;
using Application.Interfaces.Notifications;
using GameAccShop.Controllers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace GameAccShop.Notifications
{
    /// <summary>
    /// INotificationPublisher'ning SignalR ustidagi implementatsiyasi.
    /// </summary>
    public class SignalRNotificationPublisher : INotificationPublisher
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationPublisher(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task PublishAsync(int userId, NotificationResponse notification)
        {
            // Foydalanuvchi ulanmagan bo'lsa SignalR jimgina o'tkazib yuboradi —
            // u keyin sahifani ochganda bildirishnomani bazadan oladi.
            await _hubContext.Clients
                .User(userId.ToString())
                .SendAsync("ReceiveNotification", notification);
        }
    }
}
