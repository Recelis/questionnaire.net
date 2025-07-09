using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using System.Text.Json;
using LifeTracker.Dto;

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
    /// <returns>A list of QuestionnaireDtos.</returns>
    /// <response code="200">Returns the list of QuestionnaireDtos</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<QuestionnaireDto>), StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<ActionResult<IEnumerable<QuestionnaireDto>>> Get()
    {
        _logger.LogInformation("Getting all questionnaires");
        IEnumerable<Questionnaire> questionnaires = await _questionnaireService.GetAllAsync();

        IEnumerable<QuestionnaireDto> questionnaireDtos = questionnaires.Select(q => new QuestionnaireDto
        {
            Id = q.Id,
            Name = q.Name,
            CreatedBy = q.CreatedBy,
            Templates = q.Templates.Select(t => new TemplateDto
            {
                Version = t.Version,
                Name = t.Name,
                QuestionnaireId = t.QuestionnaireId
            }).ToList()
        });

        return Ok(questionnaireDtos);
    }

    /// <summary>
    /// Gets a questionnaire.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if questionnaire could not be found.
    /// </remarks>
    /// <param name="questionnaireId">The ID of the questionnaire</param>
    /// <returns>A QuestionnaireDto.</returns>
    /// <response code="200">Returns the QuestionnaireDto</response>
    /// <response code="404">No questionnaire found</response>
    [HttpGet("{questionnaireId:int}")]
    [ProducesResponseType(typeof(QuestionnaireDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<QuestionnaireDto>> GetById(int questionnaireId)
    {
        _logger.LogInformation("Getting questionnaire: {Id}", questionnaireId);
        Questionnaire? questionnaire = await _questionnaireService.GetAsync(questionnaireId);

        if (questionnaire == null)
        {
            return NotFound();
        }
        QuestionnaireDto questionnaireDto = new QuestionnaireDto
        {
            Id = questionnaire.Id,
            Name = questionnaire.Name,
            CreatedBy = questionnaire.CreatedBy,
            Templates = questionnaire.Templates.Select(t => new TemplateDto
            {
                Version = t.Version,
                Name = t.Name,
                QuestionnaireId = t.QuestionnaireId
            }).ToList()
        };
        return Ok(questionnaireDto);
    }

    /// <summary>
    /// Creates a new questionnaire.
    /// </summary>
    /// <param name="createQuestionnaireDto"></param>
    /// <response code="201">Returns the created questionnaire</response>
    [HttpPost()]
    [ProducesResponseType(typeof(QuestionnaireDto), StatusCodes.Status201Created)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Questionnaire>> Post(CreateQuestionnaireDto createQuestionnaireDto)
    {
        _logger.LogInformation("Creating new questionnaire: {Questionnaire}", JsonSerializer.Serialize(createQuestionnaireDto));
        Questionnaire? questionnaire = await _questionnaireService.CreateAsync(createQuestionnaireDto);

        if (questionnaire == null)
        {
            return NotFound();
        }

        QuestionnaireDto questionnaireDto = new QuestionnaireDto
        {
            Id = questionnaire.Id,
            Name = questionnaire.Name,
            CreatedBy = questionnaire.CreatedBy,
            Templates = questionnaire.Templates.Select(t => new TemplateDto
            {
                Version = t.Version,
                Name = t.Name,
                QuestionnaireId = t.QuestionnaireId
            }).ToList()
        };

        return CreatedAtAction(nameof(GetById), new { questionnaireId = questionnaireDto.Id }, questionnaireDto);
    }

    /// <summary>
    /// Updates a questionnaire.
    /// </summary>
    /// <param name="newQuestionnaire"></param>
    /// <response code="200">Returns the created QuestionnaireDto</response>
    /// <response code="404">If the questionnaire doesn't exists</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(QuestionnaireDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<QuestionnaireDto?>> Put(int id, [FromBody] UpdateQuestionnaireDto newQuestionnaire)
    {
        _logger.LogInformation("Updating questionnaire: {Questionnaire}", newQuestionnaire);
        Questionnaire? questionnaire = await _questionnaireService.UpdateAsync(id, newQuestionnaire);
        if (questionnaire == null)
        {
            _logger.LogInformation("questionnaire could not be found: {Id}", id);
            return NotFound();
        }

        QuestionnaireDto questionnaireDto = new QuestionnaireDto
        {
            Id = questionnaire.Id,
            Name = questionnaire.Name,
            CreatedBy = questionnaire.CreatedBy,
            Templates = questionnaire.Templates.Select(t => new TemplateDto
            {
                Version = t.Version,
                Name = t.Name,
                QuestionnaireId = t.QuestionnaireId
            }).ToList()
        };
        return Ok(questionnaireDto);
    }

    [HttpDelete("{questionnaireId:int}")]
    public async Task<IActionResult> Delete(int questionnaireId)
    {
        _logger.LogInformation("Deleting questionnaire: {Id}", questionnaireId);

        bool deleted = await _questionnaireService.DeleteAsync(questionnaireId);
        return deleted ? NoContent() : NotFound();

    }
}
