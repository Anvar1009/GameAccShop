using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.RegisterDTO
{
    public class VerifyEmailRequestDTO
    {
        [Required, EmailAddress]
        public string Login { get; set; }

        [Required, StringLength(6, MinimumLength = 6)]
        public string Code { get; set; }
    }
}
