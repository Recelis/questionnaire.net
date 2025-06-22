using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IQuestionnaireService
{
    Task<List<Questionnaire>> GetAll();
    Task<Questionnaire?> Get(int questionnaireId);
    Task<Questionnaire?> Post(Questionnaire newQuestionnaire);
    Task<Questionnaire?> Put(Questionnaire newQuestionnaire);
    Task<bool> Delete(int questionnaireId);
}