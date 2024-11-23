using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class TemplateController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<TemplateController> _logger;

    public TemplateController(ILogger<TemplateController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetTemplate")]
    public IEnumerable<Questionaire> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {
        })
        .ToArray();
    }

    [HttpPost(Name = "PostTemplate")]
    public IEnumerable<Questionaire> Post()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {
        })
        .ToArray();
    }

    [HttpPut(Name = "PutTemplate")]
    public IEnumerable<Questionaire> Put()
    {
        return Enumerable.Range(1, 5).Select(index => new Questionaire
        {
        })
        .ToArray();
    }
}
