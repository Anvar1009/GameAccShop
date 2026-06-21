using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.ProductDTOs
{
    public class GetProductDTO
    {
        public int Id { get; set; }

        public int AccStrength { get; set; }

        public int PlayerCount { get; set; }

        public int CoinsCount { get; set; }

        public decimal AccPrice { get; set; }

        public List<string> Tags { get; set; } = new();

        public List<string> Medias { get; set; } = new();
    }
}
