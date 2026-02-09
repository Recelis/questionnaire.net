using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IAnswerService
{
    Task<Answer?> GetBySubmissionQuestionAsync(int submissionId, int questionId);
    Task<Answer?> GetAsync(int answerId);
    Task<Answer> CreateAsync(CreateAnswerDto newAnswer);
    Task<Answer?> UpdateAsync(int id, UpdateAnswerDto newAnswer);
    Task<bool> DeleteAsync(int answerId);
}