namespace LifeTracker.Models;

public class Submission
{
    public int Id { get; set; }

    // public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;

    // public int UserId { get; set; }

    public int TotalPoints { get; set; }

    public int TemplateId { get; set; }
}
