namespace LifeTracker.Configuration;

public class MetricsOptions
{
    public const string SectionName = "Metrics";

    public DayOfWeek WeekStartDay { get; set; } = DayOfWeek.Sunday;
}
