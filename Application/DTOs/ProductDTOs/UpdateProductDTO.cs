using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.ProductDTOs
{
    public class UpdateProductDTO
    {
        public string AccEmail { get; set; }

        public string AccPassword { get; set; }

        public int AccStrength { get; set; }

        public int PlayerCount { get; set; }

        public int CoinsCount { get; set; }

        public decimal AccPrice { get; set; }

        public string Description { get; set; } = string.Empty;

        public List<string> Tags { get; set; } = new();

        public List<IFormFile> Medias { get; set; } = new();
    }
}
