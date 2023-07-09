using Microsoft.EntityFrameworkCore;
using RentX.Models;
using System.Reflection.Emit;
using System.Reflection.Metadata;

namespace RentX
{
    public class RentXDbContext: DbContext
    {
        public RentXDbContext(DbContextOptions options) : base(options)
        {

        }

        private void OnModelCreating(ModelBuilder modelBuilder)
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
                .HasForeignKey(e=>e.RenterId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            modelBuilder.Entity<Customer>()
                .HasMany(e => e.RentItems)
                .WithOne(e => e.Customer)
                .HasForeignKey(e => e.RentId);

        }
        public DbSet<User>? Users { get; set; }
        public DbSet<Admin>? Admins { get; set; }
        public DbSet<Customer>? Customers { get; set; }
        public DbSet<Renter>? Renters { get; set; }
        public DbSet<Item>? Items { get; set; }
    }
}
