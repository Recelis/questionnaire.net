using LifeTracker.Data;
using LifeTracker.Dto;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeTracker.Services;

public class EFSubmissionService : ISubmissionService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFSubmissionService> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public EFSubmissionService(LifeTrackerContext context, ILogger<EFSubmissionService> logger, IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _lifeTrackerContext = context;
        _logger = logger;
    }

    public async Task<List<Submission>> GetByUserAsync(int userId)
    {
        return await _lifeTrackerContext.Submission
                .Where(t => t.UserId == userId)
                .ToListAsync();
    }

    public async Task<Submission?> GetAsync(int submissionId)
    {
        return await _lifeTrackerContext.Submission.FindAsync(submissionId);
    }

    public async Task<Submission?> CreateAsync(CreateSubmissionDto createSubmissionDto)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value;
        int? userId = int.TryParse(userIdClaim, out var id) ? id : null;
        if (userId is null)
        {
            return null;
        }
        // find the Template first
        Template? template = await _lifeTrackerContext.Template.FindAsync(createSubmissionDto.TemplateId);
        if (template == null)
        {
            _logger.LogError("No Template of id {templateId}", createSubmissionDto.TemplateId);
            return null;
        }

        User? user = await _lifeTrackerContext.User.FindAsync(userId);
        if (user == null)
        {
            _logger.LogError("No User of id {userId}", userId);
            return null;
        }

        Submission newSubmission = new Submission
        {
            TemplateId = createSubmissionDto.TemplateId,
            UserId = user.Id,
            User = user
        };

        _lifeTrackerContext.Submission.Add(newSubmission);


        _logger.LogDebug("Created new Submission", newSubmission.ToString());

        await _lifeTrackerContext.SaveChangesAsync();
        return newSubmission;
    }

    /// <summary>
    /// Deletes Submission in its entirety
    /// </summary>
    /// <param name="submissionId"></param>
    /// <returns>boolean, true if success</returns>
    public async Task<bool> DeleteAsync(int submissionId)
    {
        Submission? submission = await _lifeTrackerContext.Submission.FindAsync(submissionId);
        if (submission == null)
        {
            _logger.LogWarning("Submission could not be found");
            return false;
        }
        else
        {
            using var transaction = await _lifeTrackerContext.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            _lifeTrackerContext.Remove(submission);

            await _lifeTrackerContext.SaveChangesAsync();
            // remove answers from Submission
            // int numDeleted = await _lifeTrackerContext.Answers
            //     .Where(tql => tql.SubmissionId == submission.Id)
            //     .ExecuteDeleteAsync();
            await transaction.CommitAsync();

            // if (numDeleted == 0)
            // {
            //     _logger.LogError("No Answers with {id} could be found", submission.Id);
            // }
            // else
            // {
            //     _logger.LogInformation("Deleted {numDeleted} answers", numDeleted);
            // }

            return true;
        }
    }
}