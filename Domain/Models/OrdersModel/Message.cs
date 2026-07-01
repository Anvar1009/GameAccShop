using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.OrdersModel
{
    public class Message
    {
        public int Id { get; set; }

        public int ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }

        public int SenderId { get; set; }
        public User Sender { get; set; }

        public string Text { get; set; }

        public bool IsRead { get; set; }

        public DateTime SentAt { get; set; }
    }
}
