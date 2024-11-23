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

    public DbSet<Questionaire> Questionaire => Set<Questionaire>();
    public DbSet<QuestionaireTemplate> QuestionaireTemplate => Set<QuestionaireTemplate>();
}