using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using LifeTracker.Dto;
using System.Text.Json;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class TemplateController : ControllerBase
{
    private readonly ITemplateService _templateService;
    private readonly ILogger<TemplateController> _logger;

    public TemplateController(ITemplateService templateService, ILogger<TemplateController> logger)
    {
        _templateService = templateService;
        _logger = logger;
    }

    /// <summary>
    /// Gets a templates by questionnaireId.
    /// </summary>
    /// <param name="templateId">The ID of the questionnaire</param>
    /// <returns>A TemplateDto.</returns>
    /// <response code="200">Returns a list of templates</response>
    [HttpGet("template/{questionnaireId:int}")]
    [ProducesResponseType(typeof(TemplateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<IEnumerable<TemplateDto>>> GetByQuestionnaireId(int questionnaireId)
    {
        _logger.LogInformation("Getting templates by questionnaire: {Id}", questionnaireId);
        List<Template> templates = await _templateService.GetByQuestionnaireId(questionnaireId);

        IEnumerable<TemplateDto> templateDtos = templates.Select(template => new TemplateDto
        {
            Id = template.Id,
            Version = template.Version,
            Name = template.Name,
            QuestionnaireId = template.QuestionnaireId,
        });
        return Ok(templateDtos);
    }

    /// <summary>
    /// Gets a template.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if template could not be found.
    /// </remarks>
    /// <param name="templateId">The id of the template</param>
    /// <returns>A template.</returns>
    /// <response code="200">Returns the TemplateDto</response>
    /// <response code="404">No template found</response>
    [HttpGet("{templateId:int}")]
    [ProducesResponseType(typeof(TemplateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<TemplateDto>> GetById(int templateId)
    {
        _logger.LogInformation("Getting template by id: {Id}", templateId);
        Template? template = await _templateService.GetAsync(templateId);
        if (template == null)
        {
            return NotFound();
        }
        TemplateDto templateDto = new TemplateDto
        {
            Id = template.Id,
            Version = template.Version,
            Name = template.Name,
            QuestionnaireId = template.QuestionnaireId
        };

        return Ok(templateDto);
    }

    /// <summary>
    /// Creates a new template.
    /// </summary>
    /// <remarks>
    /// Returns a 404 No Content if questionnaire of template could not be found.
    /// </remarks>
    /// <param name="createTemplateDto"></param>
    /// <response code="201">Returns the created questionnaire</response>
    [HttpPost()]
    [ProducesResponseType(typeof(TemplateDto), StatusCodes.Status201Created)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<TemplateDto>> Post(CreateTemplateDto createTemplateDto)
    {
        _logger.LogInformation("Creating new template: {Template}", JsonSerializer.Serialize(createTemplateDto));
        Template? template = await _templateService.CreateAsync(createTemplateDto);
        if (template == null)
        {
            return NotFound();
        }
        TemplateDto templateDto = new TemplateDto
        {
            Id = template.Id,
            Version = template.Version,
            Name = template.Name,
            QuestionnaireId = template.QuestionnaireId
        };
        return CreatedAtAction(nameof(GetById), new { templateId = template.Id }, templateDto);
    }

    /// <summary>
    /// Updates a template.
    /// </summary>
    /// <param name="newTemplate"></param>
    /// <response code="200">Returns the created template</response>
    /// <response code="404">If the template doesn't exists</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Template), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<TemplateDto?>> Put(int id, [FromBody] UpdateTemplateDto newTemplate)
    {
        _logger.LogInformation("Updating template: {Template}", newTemplate);
        Template? template = await _templateService.UpdateAsync(id, newTemplate);
        if (template == null)
        {
            _logger.LogInformation("template could not be found: {Id}", id);
            return NotFound();
        }
        TemplateDto templateDto = new TemplateDto
        {
            Id = template.Id,
            Version = template.Version,
            Name = template.Name,
            QuestionnaireId = template.QuestionnaireId
        };
        return Ok(templateDto);
    }

    [HttpDelete("{templateId:int}")]
    public async Task<ActionResult> DeleteAsync(int templateId)
    {
        _logger.LogInformation("Deleting template: {Id}", templateId);

        bool deleted = await _templateService.DeleteAsync(templateId);
        return deleted ? NoContent() : NotFound();
    }
}
