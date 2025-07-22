namespace LifeTracker.Models;

public class TemplateQuestionLink
{
    public int TemplateId { get; set; }

    public int QuestionId { get; set; }

    public Question Question { get; set; } = null!;
}
