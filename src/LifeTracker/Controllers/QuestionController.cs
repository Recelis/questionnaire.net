using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using System.Text.Json;
using LifeTracker.Dto;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionController : ControllerBase
{

    private readonly IQuestionService _questionService;

    private readonly ITemplateService _templateService;

    private readonly ILogger<QuestionController> _logger;

    public QuestionController(IQuestionService questionService, ITemplateService templateService, ILogger<QuestionController> logger)
    {
        _questionService = questionService;
        _templateService = templateService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all questions under a template.
    /// </summary>
    /// <returns>A list of Questions.</returns>
    /// <response code="200">Returns the list of Questions</response>
    // [HttpGet("templateId/{templateId:int}")]
    // [ProducesResponseType(typeof(IEnumerable<Question>), StatusCodes.Status200OK)]
    // [Produces("application/json")]
    // public async Task<ActionResult<IEnumerable<Question>>> Get(int templateId)
    // {
    //     _logger.LogInformation("Getting all questions");
    //     // get all templateQuestionLinks
    //     // for each templateQuestionLink get the Question
    //     IEnumerable<Question> questionnaires = await _questionService.GetByTemplateAsync(templateId);

    //     IEnumerable<Question> questionnaireDtos = questionnaires.Select(q => new QuestionDto
    //     {
    //         Id = q.Id,
    //         Name = q.Name,
    //         CreatedBy = q.CreatedBy,
    //         Templates = q.Templates.Select(t => new TemplateDto
    //         {
    //             Version = t.Version,
    //             Name = t.Name,
    //             QuestionnaireId = t.QuestionnaireId
    //         }).ToList()
    //     });

    //     return Ok(questionnaireDtos);
    // }

    /// <summary>
    /// Gets a question.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if question could not be found.
    /// </remarks>
    /// <param name="questionId">The ID of the question</param>
    /// <returns>A Question.</returns>
    /// <response code="200">Returns the Question</response>
    /// <response code="404">No question found</response>
    [HttpGet("{questionId:int}")]
    [ProducesResponseType(typeof(QuestionnaireDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<QuestionnaireDto>> GetById(int questionId)
    {
        _logger.LogInformation("Getting questionnaire: {Id}", questionId);
        Question? question = await _questionService.GetAsync(questionId);

        if (question == null)
        {
            return NotFound();
        }

        return Ok(question);
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
    public async Task<ActionResult<Questionnaire>> Post(CreateQuestionDto createQuestionDto)
    {
        _logger.LogInformation("Creating new question: {Question}", JsonSerializer.Serialize(createQuestionDto));
        // find template
        Template? template = await _templateService.GetAsync(createQuestionDto.TemplateId);

        if (template == null)
        {
            return NotFound();
        }
        // create question, templateQuestionLink with QuestionNumber appended and scoped to Template.
        Question? question = await _questionService.CreateAsync(createQuestionDto);

        return CreatedAtAction(nameof(GetById), new { questionId = question.Id }, question);
    }

    /// <summary>
    /// Updates a questionnaire.
    /// </summary>
    /// <param name="newQuestionnaire"></param>
    /// <response code="200">Returns the created QuestionnaireDto</response>
    /// <response code="404">If the questionnaire doesn't exists</response>
    // [HttpPut("{id:int}")]
    // [ProducesResponseType(typeof(QuestionnaireDto), StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status404NotFound)]
    // [Consumes("application/json")]
    // [Produces("application/json")]
    // public async Task<ActionResult<QuestionnaireDto?>> Put(int id, [FromBody] UpdateQuestionnaireDto newQuestionnaire)
    // {
    //     _logger.LogInformation("Updating questionnaire: {Questionnaire}", newQuestionnaire);
    //     Questionnaire? questionnaire = await _questionService.UpdateAsync(id, newQuestionnaire);
    //     if (questionnaire == null)
    //     {
    //         _logger.LogInformation("questionnaire could not be found: {Id}", id);
    //         return NotFound();
    //     }

    //     QuestionnaireDto questionnaireDto = new QuestionnaireDto
    //     {
    //         Id = questionnaire.Id,
    //         Name = questionnaire.Name,
    //         CreatedBy = questionnaire.CreatedBy,
    //         Templates = questionnaire.Templates.Select(t => new TemplateDto
    //         {
    //             Version = t.Version,
    //             Name = t.Name,
    //             QuestionnaireId = t.QuestionnaireId
    //         }).ToList()
    //     };
    //     return Ok(questionnaireDto);
    // }

    // [HttpDelete("{questionnaireId:int}")]
    // public async Task<IActionResult> Delete(int questionnaireId)
    // {
    //     _logger.LogInformation("Deleting questionnaire: {Id}", questionnaireId);

    //     bool deleted = await _questionService.DeleteAsync(questionnaireId);
    //     return deleted ? NoContent() : NotFound();

    // }
}
