using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.RegisterDTO
{
    public class RequestRegisterDTO
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Login { get; set; } 

        public string PasswordHash { get; set; }

        public string PhoneNumber { get; set; }
    }
}
