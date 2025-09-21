using LifeTracker.Data;
using LifeTracker.Dto;
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

    public async Task<List<Questionnaire>> GetByUserId(int userId)
    {
        return await _lifeTrackerContext.Questionnaire
                .Where(t => t.UserId == userId)
                .ToListAsync();
    }

    public async Task<Questionnaire?> GetAsync(int questionnaireId)
    {
        return await _lifeTrackerContext.Questionnaire
            .Include(q => q.Templates)
            .FirstOrDefaultAsync(q => q.Id == questionnaireId);
    }

    public async Task<Questionnaire> CreateAsync(CreateQuestionnaireDto createQuestionnaireDto)
    {
        User? user = await _lifeTrackerContext.User.FindAsync(createQuestionnaireDto.UserId);
        if (user == null)
        {
            _logger.LogError("No User of id {user}", createQuestionnaireDto.UserId);
            return null;
        }

        Questionnaire newQuestionnaire = new Questionnaire
        {
            Name = createQuestionnaireDto.Name,
            UserId = createQuestionnaireDto.UserId,
            User = user
        };
        _logger.LogDebug(newQuestionnaire.ToString());
        _lifeTrackerContext.Questionnaire.Add(newQuestionnaire);
        await _lifeTrackerContext.SaveChangesAsync();
        return newQuestionnaire;
    }

    public async Task<Questionnaire?> UpdateAsync(int id, UpdateQuestionnaireDto updateQuestionnaireDto)
    {
        try
        {
            Questionnaire? questionnaire = await _lifeTrackerContext.Questionnaire.FindAsync(id);
            if (questionnaire == null)
            {
                _logger.LogError("Questionnaire of id {questionnaire} could not be found", id);
                return null;
            }

            questionnaire.Name = updateQuestionnaireDto.Name;
            await _lifeTrackerContext.SaveChangesAsync();
            return questionnaire;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Questionnaire Put exception");
            return null;
        }
    }

    public async Task<bool> DeleteAsync(int questionnaireId)
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