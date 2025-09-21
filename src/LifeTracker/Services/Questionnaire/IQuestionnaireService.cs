using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IQuestionnaireService
{
    Task<List<Questionnaire>> GetByUserId(int userId);
    Task<Questionnaire?> GetAsync(int questionnaireId);
    Task<Questionnaire> CreateAsync(CreateQuestionnaireDto newQuestionnaire);
    Task<Questionnaire?> UpdateAsync(int id, UpdateQuestionnaireDto newQuestionnaire);
    Task<bool> DeleteAsync(int questionnaireId);
}