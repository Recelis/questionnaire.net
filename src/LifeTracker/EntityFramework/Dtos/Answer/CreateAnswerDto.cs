namespace LifeTracker.Dto;

public class CreateAnswerDto
{
    public required int QuestionId { get; set; }
    public required int SubmissionId { get; set; }
    public required string Text { get; set; } = string.Empty;
    public required int Points { get; set; }
}
