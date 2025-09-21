namespace LifeTracker.Dto;

public class CreateQuestionnaireDto
{
    public required string Name { get; set; } = string.Empty;

    public required int UserId { get; set; }
}
