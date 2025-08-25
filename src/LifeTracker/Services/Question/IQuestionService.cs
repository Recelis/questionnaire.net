using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IQuestionService
{
    Task<List<Question>> GetByTemplateAsync(int templateId);
    Task<Question?> GetAsync(int questionId);
    Task<Question> CreateAsync(CreateQuestionDto newQuestion);
    Task<Question?> UpdateAsync(int id, UpdateQuestionDto newQuestion);
    Task<bool> DeleteAsync(int questionId);
}