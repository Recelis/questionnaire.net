namespace LifeTracker.Models;

public class Question
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Text { get; set; }

    public string? ScoreExpression { get; set; }

    public int Points { get; set; }
}
