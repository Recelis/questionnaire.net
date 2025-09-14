namespace LifeTracker.Dto;

public class UpdateAnswerDto
{
    public required string Text { get; set; } = string.Empty;

    public required int Points { get; set; }
}
