using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.ProductsModels
{
    public enum ProductStatus
    {
        Active,      // Sotuvda
        Reserved,    // Buyurtma berilgan
        Sold,        // Sotilgan
        Deleted      // O'chirilgan (soft-delete)
    }
}
