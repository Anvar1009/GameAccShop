using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>Joriy foydalanuvchining bildirishnomalari (yangisi birinchi).</summary>
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            var notifications = await _notificationService.GetMyNotificationsAsync(currentUserId);

            return Ok(notifications);
        }

        /// <summary>Qo'ng'iroqchadagi raqam uchun o'qilmaganlar soni.</summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            var count = await _notificationService.GetUnreadCountAsync(currentUserId);

            return Ok(count);
        }

        /// <summary>Foydalanuvchi ro'yxatni ochdi — hammasini o'qilgan deb belgilaydi.</summary>
        [HttpPut("read")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !int.TryParse(claim.Value, out var currentUserId))
                return Unauthorized();

            await _notificationService.MarkAllAsReadAsync(currentUserId);

            return Ok();
        }
    }
}
