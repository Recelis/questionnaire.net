using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public class InMemoryQuestionnaireService : IQuestionnaireService
{
    User _user { get; } = new User
    {
        Id = 1,
        Name = "Test User",
        Email = "",
        PasswordHash = "hashedpassword"
    };

    List<Questionnaire> _questionnaires { get; } = new List<Questionnaire>();
    public InMemoryQuestionnaireService()
    {
    }

    public Task<List<Questionnaire>> GetByUserId(int userId)
    {
        return Task.FromResult(_questionnaires.ToList().FindAll(q => q.UserId == userId));
    }

    public Task<Questionnaire?> GetAsync(int questionnaireId) => Task.FromResult(_questionnaires.FirstOrDefault(x => x.Id == questionnaireId));

    public Task<Questionnaire?> CreateAsync(CreateQuestionnaireDto createQuestionnaireDto)
    {
        List<Questionnaire> questionnaires = _questionnaires.ToList();
        int maxId = questionnaires.Any() ? questionnaires.Max(q => q.Id) : 0;
        Questionnaire questionnaire = new Questionnaire
        {
            Id = maxId,
            Name = createQuestionnaireDto.Name,
            UserId = 1,
            User = _user
        };
        _questionnaires.Add(questionnaire);
        return Task.FromResult<Questionnaire?>(questionnaire);
    }

    public Task<Questionnaire?> UpdateAsync(int id, UpdateQuestionnaireDto updateQuestionnaireDto)
    {
        int index = _questionnaires.FindIndex(questionnaire => id == questionnaire.Id);
        if (index > -1)
        {
            _questionnaires[index] = new Questionnaire
            {
                Id = id,
                Name = updateQuestionnaireDto.Name,
                UserId = _questionnaires[index].UserId,
                User = _user
            };
            return Task.FromResult<Questionnaire?>(_questionnaires[index]);
        }
        else
        {
            Console.WriteLine("Failed to find the questionnaire");
            return Task.FromResult<Questionnaire?>(null);
        }


    }

    public Task<bool> DeleteAsync(int questionnaireId)
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