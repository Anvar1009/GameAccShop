using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.ProductDTOs
{
    public class CreateProductDTO
    {
        [Required]
        public int AccStrength { get; set; }

        [Required]
        public int PlayerCount { get; set; }

        [Required]
        public int CoinsCount { get; set; }

        [Required]
        public decimal AccPrice { get; set; }

        public string Description { get; set; } = string.Empty;

        [Required]
        public string AccEmail { get; set; }

        [Required]
        public string AccPassword { get; set; }


        public List<string> Tags { get; set; } = new();

        [Required]
        public List<IFormFile> Medias { get; set; } = new();
    }
}
