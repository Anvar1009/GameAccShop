using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class BuyerOrderResponse
    {
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        // Mahsulotning asosiy rasmi
        public string ProductImage { get; set; }

        // Masalan: "3190 Strength | 3500 Coins"
        public string ProductTitle { get; set; }

        public decimal Price { get; set; }

        // Sotuvchi
        public int SellerId { get; set; }

        public string SellerName { get; set; }

        // Buyurtma holati
        public OrderStatus Status { get; set; }

        // To'lov holati
        public PaymentStatus PaymentStatus { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
