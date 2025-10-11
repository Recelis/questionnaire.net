namespace LifeTracker.Dto;

public class CreateQuestionDto
{
    public required string Text { get; set; } = string.Empty;

    public required int TemplateId { get; set; }
}
