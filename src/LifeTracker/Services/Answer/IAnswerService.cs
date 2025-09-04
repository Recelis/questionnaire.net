using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IAnswerService
{
    // Task<List<Answer>> GetBySubmissionAsync(int submissionId);
    Task<Answer?> GetAsync(int answerId);
    Task<Answer> CreateAsync(CreateAnswerDto newAnswer);
    Task<Answer?> UpdateAsync(int id, UpdateAnswerDto newAnswer);
    // Task<bool> DeleteAsync(int answerId);
}