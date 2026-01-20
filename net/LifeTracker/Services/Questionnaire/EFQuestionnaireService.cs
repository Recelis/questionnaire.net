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
    private readonly IHttpContextAccessor _httpContextAccessor;
    public EFQuestionnaireService(LifeTrackerContext context, ILogger<EFQuestionnaireService> logger, IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _lifeTrackerContext = context;
        _logger = logger;
    }

    public async Task<List<Questionnaire>> GetByUserId(int userId)
    {
        return await _lifeTrackerContext.Questionnaire
                .Where(t => t.UserId == userId)
                .Include(q => q.Templates)
                .ToListAsync();
    }

    public async Task<Questionnaire?> GetAsync(int questionnaireId)
    {
        return await _lifeTrackerContext.Questionnaire
            .Include(q => q.Templates)
            .FirstOrDefaultAsync(q => q.Id == questionnaireId);
    }

    public async Task<Questionnaire?> CreateAsync(CreateQuestionnaireDto createQuestionnaireDto)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value;
        int? userId = int.TryParse(userIdClaim, out var id) ? id : null;
        if (userId is null)
        {
            return null;
        }
        User? user = await _lifeTrackerContext.User.FindAsync(userId);
        if (user == null)
        {
            _logger.LogError("No User of id {user}", userId);
            return null;
        }

        Questionnaire newQuestionnaire = new Questionnaire
        {
            Name = createQuestionnaireDto.Name,
            UserId = user.Id,
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