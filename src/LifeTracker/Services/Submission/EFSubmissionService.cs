using LifeTracker.Data;
using LifeTracker.Dto;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeTracker.Services;

public class EFSubmissionService : ISubmissionService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFSubmissionService> _logger;

    public EFSubmissionService(LifeTrackerContext context, ILogger<EFSubmissionService> logger)
    {
        _lifeTrackerContext = context;
        _logger = logger;
    }

    // public async Task<List<Submission>> GetByTemplateAsync(int templateId)
    // {
    //     return await _lifeTrackerContext.Template
    //             .Where(t => t.Id == templateId)
    //             .Include(t => t.TemplateSubmissionLinks)
    //             .ThenInclude(tql => tql.Submission)
    //             .SelectMany(t => t.TemplateSubmissionLinks.Select(tql => tql.Submission))
    //             .ToListAsync();
    // }

    public async Task<Submission?> GetAsync(int submissionId)
    {
        return await _lifeTrackerContext.Submission.FindAsync(submissionId);
    }

    public async Task<Submission?> CreateAsync(CreateSubmissionDto createSubmissionDto)
    {
        // find the Template first
        Template? template = await _lifeTrackerContext.Template.FindAsync(createSubmissionDto.TemplateId);
        if (template == null)
        {
            _logger.LogError("No Template of id {templateId}", createSubmissionDto.TemplateId);
            return null;
        }

        Submission newSubmission = new Submission
        {
            TemplateId = createSubmissionDto.TemplateId,
            CreatedBy = createSubmissionDto.CreatedBy
        };

        _lifeTrackerContext.Submission.Add(newSubmission);
        await _lifeTrackerContext.SaveChangesAsync();


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