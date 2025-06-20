using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IQuestionnaireService
{
    public List<Questionnaire> GetAll();
    public Questionnaire? Get(int questionnaireId);
    public Questionnaire? Post(Questionnaire newQuestionnaire);
    public Questionnaire? Put(Questionnaire newQuestionnaire);
    public bool Delete(int questionnaireId);
}