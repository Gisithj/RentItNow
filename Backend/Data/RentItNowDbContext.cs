using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RentItNow.Models;
using System;
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

            modelBuilder.Entity<Renter>()
                .HasMany(e => e.RentalItems)
                .WithOne(e => e.Renter)
                .HasForeignKey(e => e.RenterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Customer>()
                .HasMany(c => c.RentedItems)
                .WithOne(ri => ri.Customer)
                .HasForeignKey(ri => ri.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RentalItem>()
                 .HasOne(ri => ri.Customer)
                 .WithMany(c => c.RentedItems)
                 .HasForeignKey(ri => ri.CustomerId)
                 .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RentalItem>()
                .HasOne(ri => ri.Item)
                .WithMany(i => i.RentalItem)
                .HasForeignKey(ri => ri.ItemID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Messages>()
                .HasOne(s=>s.Sender)
                .WithMany()
                .HasForeignKey(s=>s.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Messages>()
                .HasOne(r => r.Receiver)
                .WithMany()
                .HasForeignKey(r=>r.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Messages>()
                .HasOne(m => m.Chat)
                .WithMany(c=>c.Messages)
                .HasForeignKey(c=>c.ChatId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Sender)
                .WithMany()
                .HasForeignKey(c => c.SenderId)
                .OnDelete(DeleteBehavior.Restrict); // Change to Restrict or NoAction

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Receiver)
                .WithMany()
                .HasForeignKey(c => c.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade);


        }
        public override DbSet<User> Users => Set<User>();
        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Renter> Renters => Set<Renter>();
        public DbSet<Item> Items => Set<Item>();
        public DbSet<RentalItem> RentalItem => Set<RentalItem>();
        public DbSet<RentalOption> RentalOptions => Set<RentalOption>();
        public DbSet<Messages> Messages => Set<Messages>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Chat> Chats => Set<Chat>();

    }
}
