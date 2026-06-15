using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs
{
    public class ErrorResponseDTO
    {
        public int StatusCode { get; set; }

        public string Message { get; set; }
    }
}
