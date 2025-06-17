namespace LifeTracker.Models;

public class Questionnaire
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string CreatedBy { get; set; }
}
