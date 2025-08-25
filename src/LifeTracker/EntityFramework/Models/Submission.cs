namespace LifeTracker.Models;

public class Submission
{
    public int Id { get; set; }

    public required string Date { get; set; } = string.Empty;

    public int UserId { get; set; }

    public int TotalPoints { get; set; }

    public int TemplateId { get; set; }
}
