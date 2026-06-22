using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.ProductDTOs
{
    public class UpdateProductDTO
    {
        public int Id { get; set; }

        public int AccStrength { get; set; }

        public int PlayerCount { get; set; }

        public int CoinsCount { get; set; }

        public decimal AccPrice { get; set; }

        public string Description { get; set; } = string.Empty;

        public List<string> Tags { get; set; } = new();
    }
}
