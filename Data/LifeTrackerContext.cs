using Microsoft.EntityFrameworkCore;
using LifeTracker.Models;
using System.Diagnostics.Metrics;

namespace LifeTracker.Data;

public class LifeTrackerContext : DbContext
{
    public LifeTrackerContext(DbContextOptions<LifeTrackerContext> options)
        : base(options)
    {
    }

    public DbSet<Questionnaire> Questionnaire => Set<Questionnaire>();
    public DbSet<Template> Template => Set<Template>();
}