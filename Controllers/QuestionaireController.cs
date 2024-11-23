using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;

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
            
        })
        .ToArray();
    }

    [HttpPost(Name = "PostQuestionaire")]
    public IEnumerable<Questionaire> Post()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {
        })
        .ToArray();
    }

    [HttpPut(Name = "PutQuestionaire")]
    public IEnumerable<Questionaire> Put()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {
        })
        .ToArray();
    }

    [HttpDelete(Name = "DeleteQuestionaire")]
    public IEnumerable<Questionaire> Delete()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {

        })
        .ToArray();
    }
}
