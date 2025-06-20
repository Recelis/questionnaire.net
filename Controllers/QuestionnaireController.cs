using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionnaireController : ControllerBase
{

    private readonly IQuestionnaireService _questionnaireService;

    private readonly ILogger<QuestionnaireController> _logger;

    public QuestionnaireController(IQuestionnaireService questionnaireService, ILogger<QuestionnaireController> logger)
    {
        _questionnaireService = questionnaireService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all questionnaires.
    /// </summary>
    /// <returns>A list of questionnaires.</returns>
    /// <response code="200">Returns the list of questionnaires</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Questionnaire>), StatusCodes.Status200OK)]
    [Produces("application/json")]
    public ActionResult<IEnumerable<Questionnaire>> Get()
    {
        IEnumerable<Questionnaire> questionnaires = _questionnaireService.GetAll();
        return Ok(questionnaires);
    }

    /// <summary>
    /// Gets a questionnaire.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if questionnaire could not be found.
    /// </remarks>
    /// <param name="questionnaireId">The ID of the questionnaire</param>
    /// <returns>A questionnaire.</returns>
    /// <response code="200">Returns the questionnaire</response>
    /// <response code="404">No questionnaire found</response>
    [HttpGet("{questionnaireId:int}")]
    [ProducesResponseType(typeof(Questionnaire), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public ActionResult<IEnumerable<Questionnaire>> Get(int questionnaireId)
    {
        Questionnaire? questionnaire = _questionnaireService.Get(questionnaireId);
        if (questionnaire == null)
        {
            return NotFound();
        }
        return Ok(questionnaire);
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
