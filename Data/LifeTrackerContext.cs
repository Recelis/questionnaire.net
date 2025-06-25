using Microsoft.EntityFrameworkCore;
using LifeTracker.Models;

namespace LifeTracker.Data;

public class LifeTrackerContext : DbContext
{
    public LifeTrackerContext(DbContextOptions<LifeTrackerContext> options)
        : base(options)
    {
    }

    public DbSet<Questionnaire> Questionnaire => Set<Questionnaire>();
    public DbSet<Template> Template => Set<Template>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Questionnaire>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(250);
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(250);
        });

        modelBuilder.Entity<Template>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(250);
        });
    }
}