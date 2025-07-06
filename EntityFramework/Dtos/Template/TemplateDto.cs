using LifeTracker.Models;

namespace LifeTracker.Dto;

public class TemplateDto
{
    public int Id { get; set; }

    public int Version { get; set; }

    public required string Name { get; set; }

    public int QuestionnaireId { get; set; }
}
