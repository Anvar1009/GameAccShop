using Domain.Models.ChatModels;
using System;

namespace Application.DTOs.NotificationDTOs
{
    public class NotificationResponse
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public NotificationType NotificationType { get; set; }

        /// <summary>Oluvchi shu buyurtmada kim — front link manzilini shunga qarab tanlaydi.</summary>
        public NotificationAudience Audience { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? OrderId { get; set; }
    }
}
