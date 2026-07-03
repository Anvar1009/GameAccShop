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
                    Status = ProductStatus.Active,
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

        public async Task DeleteAsync(int id)
        {
            var result = await _repository.GetByIdAsync(id);

            if (result == null)
                throw new ProductNotFoundException();

             await _repository.DeleteAsync(result);
        }

        public async Task<List<GetProductDTO>> GetAllAsync()
        {
            List<Product> result = await _repository.GetAllAsync();

            if (result is null)
            {
                throw new ProductNotFoundException();
            }

            List<string> tag2 = new List<string>();

            List<GetProductDTO> getProductDTOs = new List<GetProductDTO>(); 

            foreach (var product  in result)
            {

                foreach (var tag in product.Tags)
                {
                    tag2.Add(tag.Name);
                }

                List<string> medias = new List<string>();
                foreach (var medi in product.Medias)
                {
                    medias.Add(medi.Url);
                }

                GetProductDTO getProductDTO = new GetProductDTO()
                {
                    Id = product.Id,
                    AccPrice = product.AccPrice,
                    AccStrength = product.AccStrength,
                    CoinsCount = product.CoinsCount,
                    Description = product.Description,
                    PlayerCount = product.PlayerCount,
                    Medias = medias,
                    Tags = tag2
                };

                getProductDTOs.Add(getProductDTO);
            }

            return getProductDTOs;
        }

        public async Task<GetProductDTO?> GetByIdAsync(int id)
        {
            var result = await _repository.GetByIdAsync(id);
             
            if(result is null)
            {
                throw new ProductNotFoundException();
            }

            List<string> tag2 = new List<string>();

            foreach (var tag in result.Tags)
            {
                tag2.Add(tag.Name);
            }

            List<string> medias = new List<string>();
            foreach (var medi in result.Medias)
            {
                medias.Add(medi.Url);
            }

            GetProductDTO getProductDTO = new GetProductDTO()
            {
                Id = result.Id,
                AccPrice = result.AccPrice,
                AccStrength = result.AccStrength,
                CoinsCount = result.CoinsCount,
                Description = result.Description,
                PlayerCount = result.PlayerCount,
                Medias = medias,
                Tags = tag2
            };

            return getProductDTO;
        }

        public async Task<List<GetProductDTO>> SearchByTagAsync(string tag)
        {
            var result = await _repository.SearchByTagAsync(tag);

            if( result is null )
                throw new ProductNotFoundException();

            List<GetProductDTO> getProductDTOs = new List<GetProductDTO>();
            List<string> tag2 = new List<string>();

            foreach (var product in result)
            {

                foreach (var tag1 in product.Tags)
                {
                    tag2.Add(tag1.Name);
                }

                List<string> medias = new List<string>();
                foreach (var medi in product.Medias)
                {
                    medias.Add(medi.Url);
                }

                GetProductDTO getProductDTO = new GetProductDTO()
                {
                    Id = product.Id,
                    AccPrice = product.AccPrice,
                    AccStrength = product.AccStrength,
                    CoinsCount = product.CoinsCount,
                    Description = product.Description,
                    PlayerCount = product.PlayerCount,
                    Medias = medias,
                    Tags = tag2
                };

                getProductDTOs.Add(getProductDTO);
            }
            return getProductDTOs;

        }

        public async Task<GetProductDTO> UpdateAsync(UpdateProductDTO product)
        {

            Product product2 = await _repository.GetByIdAsync(product.Id);

            if (product2 == null)
            {
                throw new ProductNotFoundException();
            }

            if (product2.SellerId != product.SellerId)
                throw new ForbiddenException();

            product2.Tags.Clear();

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



            product2.AccEmail = product.AccEmail;
            product2.AccPasswordHash = _passwordHasher.HashPassword(product.AccPassword);
            product2.AccPrice = product.AccPrice;
            product2.AccStrength = product.AccStrength;
            product2.CoinsCount = product.CoinsCount;
            product2.Description = product.Description;
            product2.PlayerCount = product.PlayerCount;
            product2.Tags = productTags;


            foreach (var media in product2.Medias.ToList())
            {
                var filePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    media.Url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                _repository.RemoveMedia(media);
            }

            product2.Medias.Clear();

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

                product2.Medias.Add(new ProductMedia
                {
                    Url = $"/uploads/{fileName}",
                    Type = type
                });

            }

            await _repository.SaveChangesAsync();


            List<string> tag2 = new List<string>();

            foreach (var tag in product2.Tags)
            {
                tag2.Add(tag.Name);
            }

            List<string> medias = new List<string>();
            foreach (var medi in product2.Medias)
            {
                medias.Add(medi.Url);
            }

            GetProductDTO getProductDTO = new GetProductDTO()
            {
                Id = product2.Id,
                AccPrice = product2.AccPrice,
                AccStrength = product2.AccStrength,
                CoinsCount = product2.CoinsCount,
                Description = product2.Description,
                PlayerCount = product2.PlayerCount,
                Medias = medias,
                Tags = tag2
            };

            return getProductDTO;
        }
    }
}
