using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.ProductsModels
{
    public class Product
    {
        public int Id { get; set; }

        public int AccStrength { get; set; }

        public int PlayerCount { get; set; }

        public int CoinsCount { get; set; }

        public decimal AccPrice { get; set; }

        public string AccEmail { get; set; }

        public string AccPassword { get; set; }

        public ProductStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        // Seller
        public int SellerId { get; set; }

        public User Seller { get; set; }
    }
}
