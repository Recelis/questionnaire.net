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
    [HttpGet("templateId/{templateId:int}")]
    [ProducesResponseType(typeof(IEnumerable<Question>), StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<ActionResult<IEnumerable<Question>>> Get(int templateId)
    {
        _logger.LogInformation("Getting all questions under a template");
        // get all templateQuestionLinks
        // for each templateQuestionLink get the Question
        IEnumerable<Question> questions = await _questionService.GetByTemplateAsync(templateId);

        return Ok(questions);
    }

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
    /// Updates a question.
    /// </summary>
    /// <param name="newQuestion"></param>
    /// <response code="200">Returns the updated Question</response>
    /// <response code="404">If the question doesn't exists</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Question), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Question?>> Put(int id, [FromBody] UpdateQuestionDto newQuestion)
    {
        _logger.LogInformation("Updating question: {Question}", newQuestion);
        Question? question = await _questionService.UpdateAsync(id, newQuestion);
        if (question == null)
        {
            _logger.LogInformation("question could not be found: {Id}", id);
            return NotFound();
        }

        return Ok(question);
    }

    // [HttpDelete("{questionnaireId:int}")]
    // public async Task<IActionResult> Delete(int questionnaireId)
    // {
    //     _logger.LogInformation("Deleting questionnaire: {Id}", questionnaireId);

    //     bool deleted = await _questionService.DeleteAsync(questionnaireId);
    //     return deleted ? NoContent() : NotFound();

    // }
}
