using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using LifeTracker.Dto;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

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
    /// Gets the answers by submissionId and questionId.
    /// </summary>
    /// <param name="submissionId">The ID of the submission</param>
    /// <param name="questionId">The ID of the question</param>
    /// <returns>A list of answers.</returns>
    /// <response code="200">Returns a list of answers</response>
    [Authorize]
    [HttpGet("submission/{submissionId:int}/question/{questionId:int}")]
    [ProducesResponseType(typeof(List<Answer>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<Answer>> GetBySubmissionQuestion(int submissionId, int questionId)
    {
        _logger.LogInformation("Getting answers by submission: {Id} and question: {QuestionId}", submissionId, questionId);
        Answer? answer = await _answerService.GetBySubmissionQuestionAsync(submissionId, questionId);
        if (answer == null)
        {
            return NotFound();
        }

        return Ok(answer);
    }

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
    [Authorize]
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
    [Authorize]
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
    [Authorize]
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

    [Authorize]
    [HttpDelete("{answerId:int}")]
    public async Task<ActionResult> DeleteAsync(int answerId)
    {
        _logger.LogInformation("Deleting answer: {Id}", answerId);

        bool deleted = await _answerService.DeleteAsync(answerId);
        return deleted ? NoContent() : NotFound();
    }
}
