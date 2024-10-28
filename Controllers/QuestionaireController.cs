using Microsoft.AspNetCore.Mvc;
using QuestionaireModels;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionaireController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<QuestionaireController> _logger;

    public QuestionaireController(ILogger<QuestionaireController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetQuestionaire")]
    public IEnumerable<Questionaire> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
