using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.RegisterDTO
{
    public class GoogleAuthRequestDTO
    {
        [Required]
        public string IdToken { get; set; }
    }
}
