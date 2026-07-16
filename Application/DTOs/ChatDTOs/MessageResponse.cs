using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.ChatDTOs
{
    public class MessageResponse
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public int ConversationId { get; set; }

        public string SenderName { get; set; } = string.Empty;

        public string Text { get; set; } = string.Empty;

        public bool IsMine { get; set; }

        /// <summary>True once the other participant has seen the message.</summary>
        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
