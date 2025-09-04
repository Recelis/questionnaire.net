using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using LifeTracker.Dto;
using System.Text.Json;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class AnswerController : ControllerBase
{
    private readonly IAnswerService _answerService;
    private readonly ILogger<AnswerController> _logger;

    public AnswerController(IAnswerService answerService, ILogger<AnswerController> logger)
    {
        _answerService = answerService;
        _logger = logger;
    }

    /// <summary>
    /// Gets a answers by questionnaireId.
    /// </summary>
    /// <param name="answerId">The ID of the questionnaire</param>
    /// <returns>An AnswerDto.</returns>
    /// <response code="200">Returns a list of answers</response>
    // [HttpGet("answer/{questionnaireId:int}")]
    // [ProducesResponseType(typeof(AnswerDto), StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status404NotFound)]
    // [Produces("application/json")]
    // public async Task<ActionResult<IEnumerable<AnswerDto>>> GetByQuestionnaireId(int questionnaireId)
    // {
    //     _logger.LogInformation("Getting answers by questionnaire: {Id}", questionnaireId);
    //     List<Answer> answers = await _answerService.GetByQuestionnaireId(questionnaireId);

    //     IEnumerable<AnswerDto> answerDtos = answers.Select(answer => new AnswerDto
    //     {
    //         Id = answer.Id,
    //         Version = answer.Version,
    //         Name = answer.Name,
    //         QuestionnaireId = answer.QuestionnaireId,
    //     });
    //     return Ok(answerDtos);
    // }

    /// <summary>
    /// Gets a answer.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if answer could not be found.
    /// </remarks>
    /// <param name="answerId">The id of the answer</param>
    /// <returns>A answer.</returns>
    /// <response code="200">Returns the Answer</response>
    /// <response code="404">No answer found</response>
    [HttpGet("{answerId:int}")]
    [ProducesResponseType(typeof(Answer), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<Answer>> GetById(int answerId)
    {
        _logger.LogInformation("Getting answer by id: {Id}", answerId);
        Answer? answer = await _answerService.GetAsync(answerId);
        if (answer == null)
        {
            return NotFound();
        }

        return Ok(answer);
    }

    /// <summary>
    /// Creates a new answer.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if questionnaire of answer could not be found.
    /// </remarks>
    /// <param name="createAnswerDto"></param>
    /// <response code="201">Returns the created questionnaire</response>
    [HttpPost()]
    [ProducesResponseType(typeof(Answer), StatusCodes.Status201Created)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Answer>> Post(CreateAnswerDto createAnswerDto)
    {
        _logger.LogInformation("Creating new answer: {Answer}", JsonSerializer.Serialize(createAnswerDto));
        Answer? answer = await _answerService.CreateAsync(createAnswerDto);
        if (answer == null)
        {
            return NotFound();
        }

        return CreatedAtAction(nameof(GetById), new { answerId = answer.Id }, answer);
    }

    /// <summary>
    /// Updates a answer.
    /// </summary>
    /// <param name="newAnswer"></param>
    /// <response code="200">Returns the updated answer</response>
    /// <response code="404">If the answer doesn't exists</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Answer), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Answer?>> Put(int id, [FromBody] UpdateAnswerDto newAnswer)
    {
        _logger.LogInformation("Updating answer: {Answer}", newAnswer);
        Answer? answer = await _answerService.UpdateAsync(id, newAnswer);
        if (answer == null)
        {
            _logger.LogInformation("answer could not be found: {Id}", id);
            return NotFound();
        }
        return Ok(answer);
    }

    // [HttpDelete("{answerId:int}")]
    // public async Task<ActionResult> DeleteAsync(int answerId)
    // {
    //     _logger.LogInformation("Deleting answer: {Id}", answerId);

    //     bool deleted = await _answerService.DeleteAsync(answerId);
    //     return deleted ? NoContent() : NotFound();
    // }
}
