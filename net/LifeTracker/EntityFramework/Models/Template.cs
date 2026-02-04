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

    public ICollection<TemplateQuestionLink> TemplateQuestionLinks { get; set; } = new List<TemplateQuestionLink>();

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
