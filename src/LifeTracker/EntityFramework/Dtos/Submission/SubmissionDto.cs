using LifeTracker.Models;

namespace LifeTracker.Dto;

public class SubmissionDto
{
    public int Id { get; set; }

    public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;

    public int UserId { get; set; }

    public int TotalPoints { get; set; }

    public int TemplateId { get; set; }

    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
