using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.ProductsModels
{
    public class ProductTag
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }
    }
}
