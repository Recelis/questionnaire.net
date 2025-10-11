namespace LifeTracker.Models;

public class Answer
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public int SubmissionId { get; set; }

    public int Points { get; set; }

    public required string Text { get; set; }
}
