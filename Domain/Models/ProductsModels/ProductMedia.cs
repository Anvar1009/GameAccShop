using Domain.Models.Abstracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.ProductsModels
{
    public class ProductMedia
    {
        public long Id { get; set; }

        public string Url { get; set; }

        public MediaType Type { get; set; }

        public long ProductId { get; set; }

        public Product Product { get; set; }
    }
}
