using LifeTracker.Data;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace LifeTracker.Services;

public class EFQuestionnaireService : IQuestionnaireService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFQuestionnaireService> _logger;

    public EFQuestionnaireService(LifeTrackerContext context, ILogger<EFQuestionnaireService> logger)
    {
        _lifeTrackerContext = context;
        _logger = logger;
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
            bool exists = await _lifeTrackerContext.Questionnaire.AnyAsync(q => q.Id == newQuestionnaire.Id);
            if (exists)
            {
                _logger.LogWarning("Questionnaire exists");
                // Return Conflict or validation error immediately
                return null;
            }
            _lifeTrackerContext.Questionnaire.Add(newQuestionnaire);
            await _lifeTrackerContext.SaveChangesAsync();
            return newQuestionnaire;
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
        {
            return null;
        }
    }
    public async Task<Questionnaire?> Put(Questionnaire newQuestionnaire)
    {
        try
        {
            var questionnaire = await _lifeTrackerContext.Questionnaire.FindAsync(newQuestionnaire.Id);
            if (questionnaire == null)
                return null;

            // Update only allowed fields — don't touch Id or createdBy
            questionnaire.Name = newQuestionnaire.Name;
            await _lifeTrackerContext.SaveChangesAsync();
            return newQuestionnaire;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Questionnaire Put exception");
            return null;
        }
    }
    public async Task<bool> Delete(int questionnaireId)
    {
        Questionnaire? questionnaire = await _lifeTrackerContext.Questionnaire.FindAsync(questionnaireId);
        if (questionnaire == null)
        {
            _logger.LogWarning("Questionnaire could not be found");
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