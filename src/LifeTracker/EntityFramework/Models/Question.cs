namespace LifeTracker.Models;

public class Question
{
    public int Id { get; set; }

    public required int QuestionNumber { get; set; }

    public required string Text { get; set; }

    public int TemplateQuestionLinkId { get; set; }
}
