using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface ITemplateService
{
    Task<List<Template>> GetByQuestionnaireIdAsync(int questionnaireId);
    Task<Template?> GetAsync(int templateId);
    Task<Template?> CreateAsync(CreateTemplateDto newTemplate);

    Task<Template?> UpdateAsync(int id, UpdateTemplateDto newTemplate);
    Task<bool> DeleteAsync(int templateId);
}