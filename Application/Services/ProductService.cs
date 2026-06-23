using Application.DTOs.ProductDTOs;
using Application.Exceptions;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.Security;
using Application.Interfaces.ServiceInterface;
using Domain.Models.Abstracts;
using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IPasswordHasher _passwordHasher;

        public ProductService(IProductRepository productRepository, IPasswordHasher passwordHasher)
        {
            _repository = productRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<GetProductDTO> CreateAsync(CreateProductDTO product, int sellerId)
        {

            if (!product.Tags.Any())
            {
                throw new BadRequestException("At least one tag is required");
            }
            if (product.AccPrice < 0)
            {
                throw new BadRequestException("Price must be greater than zero");
            }



            var list = product.Tags;
                ICollection<ProductTag> productTags = new HashSet<ProductTag>();

                foreach (var tag in list)
                {
                    ProductTag productTag = new ProductTag()
                    {
                        Name = tag
                    };
                    productTags.Add(productTag);
                }
                


                string passHash = _passwordHasher.HashPassword(product.AccPassword);

                Product product1 = new Product()
                {
                    AccStrength = product.AccStrength,
                    AccPrice = product.AccPrice,
                    CoinsCount = product.CoinsCount,
                    PlayerCount = product.PlayerCount,
                    Description = product.Description,
                    AccEmail = product.AccEmail,
                    AccPasswordHash = passHash,
                    Status = ProductStatus.Available,
                    CreatedAt = DateTime.UtcNow,
                    Tags = productTags,
                    SellerId = sellerId,

                };


                foreach (var media in product.Medias)
                {
                    var extension = Path.GetExtension(media.FileName);

                    var fileName = $"{Guid.NewGuid()}{extension}";

                    var filePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "uploads",
                        fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await media.CopyToAsync(stream);
                    }

                    MediaType type;

                    if (extension == ".jpg" ||
                        extension == ".jpeg" ||
                        extension == ".png" ||
                        extension == ".webp")
                    {
                        type = MediaType.Image;
                    }
                    else
                    {
                        type = MediaType.Video;
                    }

                    product1.Medias.Add(new ProductMedia
                    {
                        Url = $"/uploads/{fileName}",
                        Type = type
                    });
                }

                Product product2 = await _repository.CreateAsync(product1);



            List<string> tag2 = new List<string>();

            foreach (var tag in product2.Tags)
            {
                tag2.Add(tag.Name);
            }

            List<string> medias = new List<string>();    
            foreach(var medi in product2.Medias)
            {
                medias.Add(medi.Url);    
            }




            GetProductDTO getProductDTO = new GetProductDTO()
            {
                Id= product2.Id,
                AccPrice = product2.AccPrice,
                AccStrength = product2.AccStrength,
                CoinsCount = product2.CoinsCount,
                Description = product2.Description,
                PlayerCount = product2.PlayerCount,
                Tags = tag2,
                Medias = medias
               
            };

            return getProductDTO;
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<GetProductDTO>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<GetProductDTO?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<GetProductDTO>> SearchByTagAsync(string tag)
        {
            throw new NotImplementedException();
        }

        public Task<GetProductDTO> UpdateAsync(UpdateProductDTO product)
        {
            throw new NotImplementedException();
        }
    }
}
