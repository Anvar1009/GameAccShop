using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.ProductsModels
{
    public class Product
    {
        public int Id { get; set; } 
        public int Acc_strength { get; set; }
        public int player_count { get; set; }
        public int coins_count { get; set; }
        public int Acc_price { get; set; }
        public string Acc_email { get; set; }
        public string Acc_password { get; set; }
        public int user_Id { get; set; }
        public User User { get; set; }  
    }
}
