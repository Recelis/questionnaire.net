namespace LifeTracker.Models;

public class Question
{
    public int Id { get; set; }

    public required string Text { get; set; }

    public int Points { get; set; }
}
