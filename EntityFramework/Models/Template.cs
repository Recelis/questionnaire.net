namespace LifeTracker.Models;

public class Template
{
    /// <summary>
    /// The Version acts as the Id of the Template and is always incremented by 1.
    /// </summary>
    public int Version { get; set; }

    public required string Name { get; set; }

    public int QuestionnaireId { get; set; }
    public Questionnaire? Questionnaire { get; set; }
}
