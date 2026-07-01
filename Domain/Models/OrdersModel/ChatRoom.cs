using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.OrdersModel
{
    public class ChatRoom
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public bool IsClosed { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Message> Messages { get; set; } = [];
    }
}
