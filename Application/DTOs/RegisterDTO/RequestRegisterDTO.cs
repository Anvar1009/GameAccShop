using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.RegisterDTO
{
    public class RequestRegisterDTO
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        /// <summary>Doubles as the user's email — verification codes are sent here.</summary>
        [Required, EmailAddress]
        public string Login { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }
}
