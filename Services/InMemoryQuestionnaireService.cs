using LifeTracker.Models;

namespace LifeTracker.Services;

public class InMemoryQuestionnaireService : IQuestionnaireService
{
    List<Questionnaire> _questionnaires { get; } = new List<Questionnaire>();
    public InMemoryQuestionnaireService()
    {
    }

    public List<Questionnaire> GetAll() => _questionnaires.ToList();

    public Questionnaire? Get(int questionnaireId) => _questionnaires.FirstOrDefault(x => x.Id == questionnaireId);

    public Questionnaire? Post(Questionnaire newQuestionnaire)
    {
        int newQuestionnaireId = newQuestionnaire.Id;
        int index = _questionnaires.FindIndex(questionnaire => newQuestionnaireId == questionnaire.Id);
        if (index == -1)
        {
            _questionnaires.Add(newQuestionnaire);
            return newQuestionnaire;
        }
        else
        {
            return null;
        }
    }

    public Questionnaire? Put(Questionnaire newQuestionnaire)
    {
        int newQuestionnaireId = newQuestionnaire.Id;
        int index = _questionnaires.FindIndex(questionnaire => newQuestionnaireId == questionnaire.Id);
        if (index > -1)
        {
            _questionnaires[index] = newQuestionnaire;
            return newQuestionnaire;
        }
        else
        {
            Console.WriteLine("Failed to find the questionnaire");
            return null;
        }


    }

    public bool Delete(int questionnaireId)
    {
        Questionnaire? questionnaire = _questionnaires.Find(questionnaire => questionnaire.Id == questionnaireId);
        if (questionnaire != null)
        {
            _questionnaires.Remove(questionnaire);
            return true;
        }
        else
        {
            Console.WriteLine("Failed to find the questionnaire");
            return false;
        }
    }
}