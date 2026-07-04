using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.PaymentDTO
{
    public class UploadReceiptRequest
    {
        public int PaymentId { get; set; }

        public IFormFile Receipt { get; set; }
    }
}
