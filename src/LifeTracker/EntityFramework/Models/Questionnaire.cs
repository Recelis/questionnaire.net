namespace LifeTracker.Models;

public class Questionnaire
{
    public int Id { get; set; }

    public required string Name { get; set; } = string.Empty;

    public required string CreatedBy { get; set; }

    public ICollection<Template> Templates { get; set; } = new List<Template>();
}
