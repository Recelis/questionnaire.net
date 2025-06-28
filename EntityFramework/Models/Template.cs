namespace LifeTracker.Models;

public class Template
{
    /// <summary>
    /// The Id acts as the Version of the Template and is always incremented by 1.
    /// </summary>
    public int Id { get; set; }

    public required string Name { get; set; }

    public int QuestionnaireId { get; set; }
    public Questionnaire Questionnaire { get; set; } = null!;
}
