using LifeTracker.Models;

namespace LifeTracker.Services;

public class InMemoryQuestionnaireService : IQuestionnaireService
{
    List<Questionnaire> _questionnaires { get; } = new List<Questionnaire>();
    public InMemoryQuestionnaireService()
    {
    }

    public Task<List<Questionnaire>> GetAll()
    {
        return Task.FromResult(_questionnaires.ToList());
    }

    public Task<Questionnaire?> Get(int questionnaireId) => Task.FromResult(_questionnaires.FirstOrDefault(x => x.Id == questionnaireId));

    public Task<Questionnaire?> Post(Questionnaire newQuestionnaire)
    {
        int newQuestionnaireId = newQuestionnaire.Id;
        int index = _questionnaires.FindIndex(questionnaire => newQuestionnaireId == questionnaire.Id);
        if (index == -1)
        {
            _questionnaires.Add(newQuestionnaire);
            return Task.FromResult<Questionnaire?>(newQuestionnaire);
        }
        else
        {
            return Task.FromResult<Questionnaire?>(null);
        }
    }

    public Task<Questionnaire?> Put(Questionnaire newQuestionnaire)
    {
        int newQuestionnaireId = newQuestionnaire.Id;
        int index = _questionnaires.FindIndex(questionnaire => newQuestionnaireId == questionnaire.Id);
        if (index > -1)
        {
            _questionnaires[index] = newQuestionnaire;
            return Task.FromResult<Questionnaire?>(newQuestionnaire);
        }
        else
        {
            Console.WriteLine("Failed to find the questionnaire");
            return Task.FromResult<Questionnaire?>(null);
        }


    }

    public Task<bool> Delete(int questionnaireId)
    {
        Questionnaire? questionnaire = _questionnaires.Find(questionnaire => questionnaire.Id == questionnaireId);
        if (questionnaire != null)
        {
            _questionnaires.Remove(questionnaire);
            return Task.FromResult(true);
        }
        else
        {
            Console.WriteLine("Failed to find the questionnaire");
            return Task.FromResult(false);
        }
    }
}