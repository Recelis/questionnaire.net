using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionnaireController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<QuestionnaireController> _logger;

    public QuestionnaireController(ILogger<QuestionnaireController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetQuestionnaire")]
    public IEnumerable<Questionnaire> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionnaire
        {
            Name = $"{index}",
            CreatedBy = "",
        })
        .ToArray();
    }

    [HttpPost(Name = "PostQuestionnaire")]
    public IEnumerable<Questionnaire> Post()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionnaire
        {
            Name = $"{index}",
            CreatedBy = "",
        })
        .ToArray();
    }

    [HttpPut(Name = "PutQuestionnaire")]
    public IEnumerable<Questionnaire> Put()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionnaire
        {
            Name = $"{index}",
            CreatedBy = "",
        })
        .ToArray();
    }

    [HttpDelete(Name = "DeleteQuestionnaire")]
    public IEnumerable<Questionnaire> Delete()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionnaire
        {
            Name = $"{index}",
            CreatedBy = "",
        })
        .ToArray();
    }
}
