using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.ChatDTOs
{
    public class ConversationResponse
    {
        public int ConversationId { get; set; }

        public int OrderId { get; set; }

        public List<MessageResponse> Messages { get; set; }
            = new();
    }

}
