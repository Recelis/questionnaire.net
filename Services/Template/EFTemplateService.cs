using LifeTracker.Data;
using LifeTracker.Dto;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeTracker.Services;

public class EFTemplateService : ITemplateService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFTemplateService> _logger;

    public EFTemplateService(LifeTrackerContext context, ILogger<EFTemplateService> logger)
    {
        _lifeTrackerContext = context;
        _logger = logger;
    }

    public async Task<List<Template>> GetByQuestionnaireId(int questionnaireId)
    {
        return await _lifeTrackerContext.Template.Where(template => template.Questionnaire.Id == questionnaireId).ToListAsync();
    }

    public async Task<Template?> GetAsync(int templateId)
    {
        return await _lifeTrackerContext.Template.FindAsync(templateId);
    }

    public async Task<Template?> CreateAsync(CreateTemplateDto createTemplateDto)
    {
        // find the Questionnaire first
        Questionnaire? questionnaire = await _lifeTrackerContext.Questionnaire.FindAsync(createTemplateDto.QuestionnaireId);
        if (questionnaire == null)
        {
            _logger.LogError("No Questionnaire of id {questionnaire}", createTemplateDto.QuestionnaireId);
            return null;
        }

        Template newTemplate = new Template
        {
            Name = createTemplateDto.Name,
            QuestionnaireId = createTemplateDto.QuestionnaireId,
        };
        _logger.LogDebug(newTemplate.ToString());
        _lifeTrackerContext.Template.Add(newTemplate);

        await _lifeTrackerContext.SaveChangesAsync();
        return newTemplate;
    }

    public async Task<Template?> UpdateAsync(int id, UpdateTemplateDto updateTemplateDto)
    {
        try
        {
            Template? template = await _lifeTrackerContext.Template.FindAsync(id);
            if (template == null)
            {
                _logger.LogError("Could not find template of id {template}", id);
                return null;
            }

            template.Name = updateTemplateDto.Name;
            await _lifeTrackerContext.SaveChangesAsync();
            return template;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Questionnaire Put exception");
            return null;
        }
    }

    public async Task<bool> DeleteAsync(int templateId)
    {
        Template? template = await _lifeTrackerContext.Template.FindAsync(templateId);
        if (template == null)
        {
            _logger.LogWarning("Template could not be found");
            return false;
        }
        else
        {
            _lifeTrackerContext.Remove(template);
            // remove from template from Questionnaire
            Questionnaire? questionnaire = await _lifeTrackerContext.Questionnaire.FindAsync(template.QuestionnaireId);
            if (questionnaire == null)
            {
                _logger.LogError("Questionnaire of id {questionnaire} could not be deleted", template.QuestionnaireId);
            }
            else
            {
                questionnaire.Templates.Remove(template);
            }
            await _lifeTrackerContext.SaveChangesAsync();
            return true;
        }
    }
}