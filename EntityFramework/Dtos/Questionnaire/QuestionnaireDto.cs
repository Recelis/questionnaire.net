namespace LifeTracker.Dto;

public class QuestionnaireDto
{
    public int Id { get; set; }

    public required string Name { get; set; } = string.Empty;

    public required string CreatedBy { get; set; }

    public required List<TemplateDto> Templates { get; set; }

}
