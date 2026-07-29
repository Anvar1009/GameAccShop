using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class ProductHasPaidOrderException : Exception
    {
        public ProductHasPaidOrderException()
        : base("To'lov qilingan mahsulotni o'chirib bo'lmaydi")
        {
        }
    }
}
