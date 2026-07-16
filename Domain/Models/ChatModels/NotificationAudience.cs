using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.ChatModels
{
    /// <summary>
    /// Bildirishnomani oluvchi shu buyurtmada qaysi tomonda turgani.
    ///
    /// NotificationType yetarli emas: PaymentConfirmed va PaymentReleased ham
    /// xaridorga, ham sotuvchiga boradi, va front ularni turli sahifalarga
    /// (/orders/{id} yoki /seller/orders/{id}) ulashi kerak. Rol yozuv
    /// yaratilayotganda aniq ma'lum, shuning uchun shu yerda saqlanadi.
    /// </summary>
    public enum NotificationAudience
    {
        Buyer,

        Seller,

        Admin
    }
}
