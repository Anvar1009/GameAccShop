using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.ChatDTOs
{
    public class SendMessageRequest
    {
        public int OrderId { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
