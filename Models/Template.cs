namespace LifeTracker.Models;

public class Template
{
    public int Id { get; set; }

    public required string Name { get; set; } = string.Empty;

    public int Version { get; set; }
}
