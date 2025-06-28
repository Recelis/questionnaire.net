using LifeTracker.Models;

namespace LifeTracker.Dto;

public class CreateTemplateDto
{
    public required string Name { get; set; }
    public int QuestionnaireId { get; set; }
    public Questionnaire Questionnaire { get; set; } = null!;
}
