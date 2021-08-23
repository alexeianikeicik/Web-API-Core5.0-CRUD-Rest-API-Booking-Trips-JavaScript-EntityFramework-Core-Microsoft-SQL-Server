using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace WebAPICore5_0W.Models
{
    public partial class OrdersTripsAppDBContext : DbContext
    {
        public OrdersTripsAppDBContext()
        {
        }

        public OrdersTripsAppDBContext(DbContextOptions<OrdersTripsAppDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Trip> Trips { get; set; }

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
//                optionsBuilder.UseSqlServer("Server=.;Database=OrdersTripsAppDB;Trusted_Connection=True;");
//            }
//        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Cyrillic_General_CI_AS");

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Fio)
                    .HasMaxLength(50)
                    .HasColumnName("fio");

                entity.Property(e => e.IdTrip).HasColumnName("idTrip");

                entity.HasOne(d => d.IdTripNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.IdTrip)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Orders_Trips");
            });

            modelBuilder.Entity<Trip>(entity =>
            {
                entity.HasKey(e => e.IdTrip);

                entity.Property(e => e.IdTrip).HasColumnName("idTrip");

                entity.Property(e => e.FinishLocation)
                    .HasMaxLength(50)
                    .HasColumnName("finishLocation");

                entity.Property(e => e.Ordered).HasColumnName("ordered");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.StartLocation)
                    .HasMaxLength(50)
                    .HasColumnName("startLocation");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
