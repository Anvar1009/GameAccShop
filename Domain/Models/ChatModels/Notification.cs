using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.ChatModels
{
    public class Notification
    {
        public int Id { get; set; } 

        public int userId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public NotificationType notificationType { get; set; }
        public bool IsRead { get; set; }

        // Har bir bildirishnoma bitta buyurtmaga tegishli — front bosilganda
        // shu buyurtma sahifasiga o'tadi.
        public int? OrderId { get; set; }

        // Oluvchi shu buyurtmada kim: xaridor, sotuvchi yoki admin.
        public NotificationAudience Audience { get; set; }

    }
}
