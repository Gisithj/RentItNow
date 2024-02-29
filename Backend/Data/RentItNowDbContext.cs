using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RentItNow.Models;
using System.Reflection.Emit;
using System.Reflection.Metadata;

namespace RentItNow.Data
{
    public class RentItNowDbContext : IdentityDbContext<User>
    {
        public RentItNowDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<Renter>()
                .HasMany(e => e.Items)
                .WithOne(e => e.Renter)
                .HasForeignKey(e => e.RenterId)
                .OnDelete(DeleteBehavior.Restrict);
                

            modelBuilder.Entity<Customer>()
                .HasMany(e => e.RentedItems)
                .WithOne(e => e.Customer)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RentalItem>()
                 .HasOne(ri => ri.Customer)
                 .WithMany(c => c.RentedItems)
                 .HasForeignKey(ri => ri.CustomerId)
                 .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RentalItem>()
                .HasOne(ri => ri.Item)
                .WithMany()
                .HasForeignKey(ri => ri.ItemID)
                .OnDelete(DeleteBehavior.Restrict);



        }
        public override DbSet<User> Users => Set<User>();
        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Renter> Renters => Set<Renter>();
        public DbSet<Item> Items => Set<Item>();
    }
}
