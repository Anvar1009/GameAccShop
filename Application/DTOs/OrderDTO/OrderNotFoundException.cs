using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class OrderNotFoundException:Exception
    {
        public OrderNotFoundException():base("Order not found.")
        {
            
        }
    }
}
