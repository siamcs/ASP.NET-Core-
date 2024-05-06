using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Test.Models;

public partial class StudentDbContext : DbContext
{
    public StudentDbContext()
    {
    }

    public StudentDbContext(DbContextOptions<StudentDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("server=(localdb)\\MSSQLLocalDB; database=StudentDB; trusted_connection=true; trustservercertificate=true; integrated security=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PK__Courses__C92D71A759926E1A");

            entity.Property(e => e.CourseName)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.HasKey(e => e.ModuleId).HasName("PK__Modules__2B7477A717C83CE3");

            entity.Property(e => e.ModuleName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Student).WithMany(p => p.Modules)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Modules__Student__29572725");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Students__32C52B990F1BD6B2");

            entity.Property(e => e.Dob).HasColumnType("date");
            entity.Property(e => e.ImageUrl)
                .IsUnicode(false)
                .HasColumnName("ImageURL");
            entity.Property(e => e.MobileNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.StudentName)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.HasOne(d => d.Course).WithMany(p => p.Students)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("FK__Students__Course__267ABA7A");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
