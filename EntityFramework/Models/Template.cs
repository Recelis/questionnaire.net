namespace LifeTracker.Models;

public class Template
{
    public int Id { get; set; }

    /// <summary>
    /// The Version is an int and scoped by the Questionnaire.
    /// </summary>
    public int Version { get; set; }

    public required string Name { get; set; }

    public int QuestionnaireId { get; set; }
    public Questionnaire? Questionnaire { get; set; }
}
