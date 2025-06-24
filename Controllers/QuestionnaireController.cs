using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using System.Text.Json;

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
    public async Task<ActionResult<IEnumerable<Questionnaire>>> Get()
    {
        _logger.LogInformation("Getting all questionnaires");
        IEnumerable<Questionnaire> questionnaires = await _questionnaireService.GetAll();
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
    public async Task<ActionResult<Questionnaire>> GetById(int questionnaireId)
    {
        _logger.LogInformation("Getting all questionnaires: {Id}", questionnaireId);
        Questionnaire? questionnaire = await _questionnaireService.Get(questionnaireId);
        if (questionnaire == null)
        {
            return NotFound();
        }
        return Ok(questionnaire);
    }

    /// <summary>
    /// Creates a new questionnaire.
    /// </summary>
    /// <param name="newQuestionnaire"></param>
    /// <response code="201">Returns the created questionnaire</response>
    /// <response code="409">If the questionnaire already exists</response>
    [HttpPost()]
    [ProducesResponseType(typeof(Questionnaire), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Questionnaire>> Post(Questionnaire newQuestionnaire)
    {
        _logger.LogInformation("Creating new questionnaire: {Questionnaire}", JsonSerializer.Serialize(newQuestionnaire));
        Questionnaire? questionnaire = await _questionnaireService.Post(newQuestionnaire);
        if (questionnaire == null)
        {
            _logger.LogInformation("questionnaire already exists: {Id}", newQuestionnaire.Id);
            return Conflict("Already exists");
        }
        return CreatedAtAction(nameof(GetById), new { questionnaireId = questionnaire.Id }, questionnaire);
    }

    /// <summary>
    /// Updates a questionnaire.
    /// </summary>
    /// <param name="newQuestionnaire"></param>
    /// <response code="200">Returns the created questionnaire</response>
    /// <response code="409">If the questionnaire already exists</response>
    [HttpPut()]
    [ProducesResponseType(typeof(Questionnaire), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Questionnaire?>> Put(Questionnaire newQuestionnaire)
    {
        _logger.LogInformation("Updating questionnaire: {Questionnaire}", newQuestionnaire);
        Questionnaire? questionnaire = await _questionnaireService.Put(newQuestionnaire);
        if (questionnaire == null)
        {
            _logger.LogInformation("questionnaire could not be found: {Id}", newQuestionnaire.Id);
            return NotFound();
        }
        return Ok(questionnaire);
    }

    [HttpDelete("{questionnaireId:int}")]
    public async Task<IActionResult> Delete(int questionnaireId)
    {
        _logger.LogInformation("Deleting questionnaire: {Id}", questionnaireId);

        bool deleted = await _questionnaireService.Delete(questionnaireId);
        return deleted ? NoContent() : NotFound();

    }
}
