using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace GameAccShop.Controllers.Hubs
{
    /// <summary>
    /// Bildirishnomalar uchun real vaqtli kanal.
    ///
    /// ChatHub'dan farqi: bu yerda guruh yo'q. SignalR'ning standart
    /// IUserIdProvider'i ClaimTypes.NameIdentifier claim'ini o'qiydi (JwtProvider
    /// uni user.Id bilan to'ldiradi), shuning uchun server
    /// Clients.User("{userId}") orqali to'g'ridan-to'g'ri odamga yubora oladi —
    /// uning nechta tab ochgani muhim emas.
    ///
    /// Klientga keladigan chaqiruvlar: "ReceiveNotification" (NotificationResponse).
    /// Klient chaqiradigan metod yo'q — ulanishning o'zi kifoya.
    /// </summary>
    [Authorize]
    public class NotificationHub : Hub
    {
    }
}
