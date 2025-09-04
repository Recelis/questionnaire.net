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

    public DbSet<TemplateQuestionLink> TemplateQuestionLink { get; set; }
    public DbSet<Question> Question { get; set; }
    public DbSet<Submission> Submission { get; set; }
    public DbSet<Answer> Answer { get; set; }

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

            // Change this to be User Id in the future
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(250);
        });

        modelBuilder.Entity<Template>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();
            entity
                .HasIndex(t => new { t.QuestionnaireId, t.Version })
                .IsUnique();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(250);

            entity.HasOne(t => t.Questionnaire)
                .WithMany(q => q.Templates)
                .HasForeignKey(t => t.QuestionnaireId)
                .HasConstraintName("fk_template_questionnaire")
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(t => t.QuestionnaireId)
                  .HasColumnName("questionnaire_id");
        });

        modelBuilder.Entity<TemplateQuestionLink>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity
                .HasIndex(e => new { e.TemplateId, e.QuestionId })
                .IsUnique();

            entity.Property(t => t.QuestionNumber)
                .IsRequired()
                .HasDefaultValue(0);

            entity.HasOne<Template>()
                .WithMany(e => e.TemplateQuestionLinks)
                .HasForeignKey(e => e.TemplateId)
                .HasConstraintName("fk_templatequestionlink_template")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Question)
                .WithMany()
                .HasForeignKey(e => e.QuestionId)
                .HasConstraintName("fk_templatequestionlink_question")
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(e => e.Points)
                .IsRequired()
                .HasDefaultValue(0);

        });

        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Date)
                .IsRequired()
                .HasMaxLength(250);

            // Change this to be User Id in the future
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(e => e.TotalPoints)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(t => t.TemplateId)
                  .HasColumnName("template_id");
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(t => t.SubmissionId)
                .HasColumnName("submission_id");

            entity.Property(t => t.QuestionId)
                .HasColumnName("question_id");

            entity.Property(t => t.Points)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(t => t.Text)
                .IsRequired()
                .HasMaxLength(1000);

            entity.HasOne<Submission>()
                .WithMany(e => e.Answer)
                .HasForeignKey(e => e.SubmissionId)
                .HasConstraintName("fk_answer_submission")
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}