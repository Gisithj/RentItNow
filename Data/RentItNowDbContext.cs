using Microsoft.EntityFrameworkCore;
using RentItNow.Models;
using System.Reflection.Emit;
using System.Reflection.Metadata;

namespace RentItNow.Data
{
    public class RentItNowDbContext : DbContext
    {
        public RentItNowDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(e => e.Renter)
                .WithOne(e => e.User)
                .HasForeignKey<Renter>(e => e.RenterId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            modelBuilder.Entity<User>()
                .HasOne(e => e.Customer)
                .WithOne(e => e.User)
                .HasForeignKey<Customer>(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            modelBuilder.Entity<Renter>()
                .HasMany(e => e.Items)
                .WithOne(e => e.Renter)
                .HasForeignKey(e => e.RenterId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            modelBuilder.Entity<Customer>()
                .HasMany(e => e.RentItems)
                .WithOne(e => e.Customer)
                .HasForeignKey(e => e.RentId);

        }
        public DbSet<User> Users => Set<User>();
        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Renter> Renters => Set<Renter>();
        public DbSet<Item> Items => Set<Item>();
    }
}
