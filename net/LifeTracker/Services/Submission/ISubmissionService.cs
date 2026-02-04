using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface ISubmissionService
{
    Task<List<Submission>> GetByQuestionnaireAsync(int questionnaireId);
    Task<Submission?> GetAsync(int submissionId);
    Task<Submission?> CreateAsync(CreateSubmissionDto newSubmission);

    // Task<Submission> UpdateTotalPointsAsync(int submissionId); TODO when answers model implemented
    Task<bool> DeleteAsync(int submissionId);
}