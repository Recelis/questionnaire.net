using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionnaireController : ControllerBase
{

    private readonly QuestionnaireService _questionnaireService;

    private readonly ILogger<QuestionnaireController> _logger;

    public QuestionnaireController(QuestionnaireService questionnaireService, ILogger<QuestionnaireController> logger)
    {
        _questionnaireService = questionnaireService;
        _logger = logger;
    }

    [HttpGet(Name = "questionnaire")]
    public ActionResult<IEnumerable<Questionnaire>> Get()
    {
        IEnumerable<Questionnaire> questionnaires = _questionnaireService.GetAll();
        if (questionnaires == null)
        {
            return NoContent();
        }
        return Ok(questionnaires);
    }

    [HttpPost(Name = "questionnaire")]
    public ActionResult<Questionnaire> Post(Questionnaire newQuestionnaire)
    {

        Questionnaire? questionnaire = _questionnaireService.Post(newQuestionnaire);
        if (questionnaire == null)
        {
            return Conflict("Already exists");
        }
        return Ok(questionnaire);
    }

    [HttpPut(Name = "questionnaire")]
    public ActionResult<Questionnaire?> Put(Questionnaire newQuestionnaire)
    {
        Questionnaire? questionnaire = _questionnaireService.Put(newQuestionnaire);
        if (questionnaire == null)
        {
            return NotFound();
        }
        return Ok(questionnaire);
    }

    [HttpDelete(Name = "questionnaire")]
    public IActionResult Delete(int questionnaireId)
    {
        bool deleted = _questionnaireService.Delete(questionnaireId);
        if (deleted)
        {
            return NoContent();
        }
        return NotFound();

    }
}
