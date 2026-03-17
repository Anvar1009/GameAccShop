using Domain.Models.Abstracts;
using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.UserModels
{
    public class User
    {
        public int Id { get; set; } 
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public DateTime Date { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public string phone_number { get; set; }
        public int balance { get; set; }
        public bool is_active { get; set; }
        public List<Product> products { get; set; } 

    }
}
