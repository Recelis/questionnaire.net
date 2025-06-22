using System.Threading.Tasks;
using LifeTracker.Data;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeTracker.Services;

public class EFQuestionnaireService : IQuestionnaireService
{
    private readonly LifeTrackerContext _lifeTrackerContext;

    public EFQuestionnaireService(LifeTrackerContext context)
    {
        _lifeTrackerContext = context;
    }
    public async Task<List<Questionnaire>> GetAll()
    {
        return await _lifeTrackerContext.Questionnaire.ToListAsync();
    }
    public async Task<Questionnaire?> Get(int questionnaireId)
    {
        return await _lifeTrackerContext.Questionnaire.FindAsync(questionnaireId);
    }
    public async Task<Questionnaire?> Post(Questionnaire newQuestionnaire)
    {
        try
        {
            _lifeTrackerContext.Questionnaire.Add(newQuestionnaire);
            await _lifeTrackerContext.SaveChangesAsync();
            return newQuestionnaire;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return null;
        }
    }
    public async Task<Questionnaire?> Put(Questionnaire newQuestionnaire)
    {
        try
        {
            _lifeTrackerContext.Questionnaire.Update(newQuestionnaire);
            await _lifeTrackerContext.SaveChangesAsync();
            return newQuestionnaire;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return null;
        }
    }
    public async Task<bool> Delete(int questionnaireId)
    {
        Questionnaire? questionnaire = await _lifeTrackerContext.Questionnaire.FindAsync(questionnaireId);
        if (questionnaire == null)
        {
            return false;
        }
        else
        {
            _lifeTrackerContext.Remove(questionnaire);
            await _lifeTrackerContext.SaveChangesAsync();
            return true;
        }
    }
}