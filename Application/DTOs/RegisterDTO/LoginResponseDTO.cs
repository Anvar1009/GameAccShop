using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.RegisterDTO
{
    public class LoginResponseDTO
    {
        public int UserId { get; set; }

        public string Login { get; set; }

        public string Token { get; set; }
    }
}
