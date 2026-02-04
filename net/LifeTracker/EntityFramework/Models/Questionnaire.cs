namespace LifeTracker.Models;

public class Questionnaire
{
    public int Id { get; set; }

    public required string Name { get; set; } = string.Empty;

    public int UserId { get; set; }

    public required User User { get; set; }

    public ICollection<Template> Templates { get; set; } = new List<Template>();
}
