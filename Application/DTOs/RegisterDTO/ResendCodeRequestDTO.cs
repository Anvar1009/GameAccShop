using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.RegisterDTO
{
    public class ResendCodeRequestDTO
    {
        [Required, EmailAddress]
        public string Login { get; set; }
    }
}
