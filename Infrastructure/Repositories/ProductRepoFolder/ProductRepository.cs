using Application.Interfaces.Repositories_interface;
using Domain.Models.ProductsModels;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories.ProductRepoFolder
{
    public class ProductRepository : IProductRepository
    {
        private readonly DbContextModel _dbContext;
        public ProductRepository(DbContextModel dbContext)
        {
            _dbContext = dbContext;            
        }


        public async Task<Product> CreateAsync(Product product)
        {
            try
            {
                _dbContext.products.Add(product);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }
            return product;
        }

        public async Task DeleteAsync(Product product)
        {
           
            _dbContext.products.Remove(product);

            await _dbContext.SaveChangesAsync();

        }

        public async  Task<List<Product>> GetAllAsync()
        {
            var result = new List<Product>();

            result = await _dbContext.products.ToListAsync();
            
            return result;  
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            var result = await _dbContext.products.
                Include(x => x.Tags).
                Include(a => a.Medias).
                FirstOrDefaultAsync(z => z.Id == id);

            return result;
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Product>> SearchByTagAsync(string tag)
        {
            var products = await _dbContext.products.
                Include(t=>t.Tags).
                Include(s=>s.Medias)
                .Where(x => x.Tags.Any(t => t.Name == tag))
                .ToListAsync();

            return products;
        }

        public async Task<Product> UpdateAsync(Product product)
        {
            _dbContext.products.Update(product);

            await _dbContext.SaveChangesAsync();

            return product;
        }

        public void RemoveMedia(ProductMedia media)
        {
            _dbContext.ProductMedias.Remove(media);
        }


    }
}
