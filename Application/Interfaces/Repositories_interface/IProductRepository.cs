using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Repositories_interface
{
    public interface IProductRepository
    {
        Task<Product> CreateAsync(Product product);

        Task<List<Product>> GetAllAsync();

        Task<Product?> GetByIdAsync(int id);

        Task<List<Product>> GetSellerProductsAsync(int sellerId);

        Task<List<Product>> SearchByTagAsync(string tag);

        Task<Product> UpdateAsync(Product product);

        Task DeleteAsync(Product product);

        Task SaveChangesAsync();

        void RemoveMedia(ProductMedia media);
    }
}
