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
    public IEnumerable<Template> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new Template
        {
            Name = $"{index}",
        })
        .ToArray();
    }

    [HttpPost(Name = "PostTemplate")]
    public IEnumerable<Template> Post()
    {
        return Enumerable.Range(1, 5).Select(index => new Template
        {
            Name = $"{index}",
        })
        .ToArray();
    }

    [HttpPut(Name = "PutTemplate")]
    public IEnumerable<Template> Put()
    {
        return Enumerable.Range(1, 5).Select(index => new Template
        {
            Name = $"{index}",
        })
        .ToArray();
    }
}
