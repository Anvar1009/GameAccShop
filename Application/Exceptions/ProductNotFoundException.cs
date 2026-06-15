using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class ProductNotFoundException: Exception
    {
        public ProductNotFoundException()
        : base("Bunday mahsulot mavjud emas")
        {
        }
    }
}
