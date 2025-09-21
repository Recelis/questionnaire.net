namespace LifeTracker.Dto;

public class CreateSubmissionDto
{
    public required int TemplateId { get; set; }

    public int UserId { get; set; }
}
