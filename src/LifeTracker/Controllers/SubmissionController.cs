using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using System.Text.Json;
using LifeTracker.Dto;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class SubmissionController : ControllerBase
{

    private readonly ISubmissionService _SubmissionService;

    private readonly ITemplateService _templateService;

    private readonly ISubmissionService _submissionService;

    private readonly ILogger<SubmissionController> _logger;

    public SubmissionController(ISubmissionService submissionService, ITemplateService templateService, ILogger<SubmissionController> logger)
    {
        _submissionService = submissionService;
        _templateService = templateService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all submissions under a template.
    /// </summary>
    /// <returns>A list of Submissions.</returns>
    /// <response code="200">Returns the list of Submissions</response>
    // [HttpGet("templateId/{templateId:int}")]
    // [ProducesResponseType(typeof(IEnumerable<Submission>), StatusCodes.Status200OK)]
    // [Produces("application/json")]
    // public async Task<ActionResult<IEnumerable<Submission>>> Get(int templateId)
    // {
    //     _logger.LogInformation("Getting all submissions under a template");
    //     // get all templateSubmissionLinks
    //     // for each templateSubmissionLink get the Submission
    //     IEnumerable<Submission> submissions = await _submissionService.GetByTemplateAsync(templateId);

    //     return Ok(submissions);
    // }

    /// <summary>
    /// Gets a submission.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if submission could not be found.
    /// </remarks>
    /// <param name="submissionId">The ID of the submission</param>
    /// <returns>A Submission.</returns>
    /// <response code="200">Returns the Submission</response>
    /// <response code="404">No submission found</response>
    [HttpGet("{submissionId:int}")]
    [ProducesResponseType(typeof(Submission), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<Submission>> GetById(int submissionId)
    {
        _logger.LogInformation("Getting submission: {Id}", submissionId);
        Submission? submission = await _submissionService.GetAsync(submissionId);

        if (submission == null)
        {
            return NotFound();
        }

        return Ok(submission);
    }

    /// <summary>
    /// Creates a new submission.
    /// </summary>
    /// <param name="createSubmissionDto"></param>
    /// <response code="201">Returns the created submission</response>
    [HttpPost()]
    [ProducesResponseType(typeof(Submission), StatusCodes.Status201Created)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<Submission>> Post(CreateSubmissionDto createSubmissionDto)
    {
        _logger.LogInformation("Creating new submission: {Submission}", JsonSerializer.Serialize(createSubmissionDto));
        // find template
        Template? template = await _templateService.GetAsync(createSubmissionDto.TemplateId);

        if (template == null)
        {
            return NotFound();
        }
        // create submission, templateSubmissionLink with SubmissionNumber appended and scoped to Template.
        Submission? submission = await _submissionService.CreateAsync(createSubmissionDto);

        return CreatedAtAction(nameof(GetById), new { submissionId = submission.Id }, submission);
    }

    [HttpDelete("{submissionId:int}")]
    public async Task<IActionResult> Delete(int submissionId)
    {
        _logger.LogInformation("Deleting submission: {Id}", submissionId);

        bool deleted = await _submissionService.DeleteAsync(submissionId);
        return deleted ? NoContent() : NotFound();

    }
}
