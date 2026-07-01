using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;

namespace Application.Interfaces.UnitOfWorkFolder
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync();

        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}
