using LifeTracker.Data;
using LifeTracker.Dto;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeTracker.Services;

public class EFAnswerService : IAnswerService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFAnswerService> _logger;

    public EFAnswerService(LifeTrackerContext context, ILogger<EFAnswerService> logger)
    {
        _lifeTrackerContext = context;
        _logger = logger;
    }

    public async Task<Answer?> GetBySubmissionQuestionAsync(int submissionId, int questionId)
    {
        return await _lifeTrackerContext.Answer
                .Where(t => t.SubmissionId == submissionId && t.QuestionId == questionId)
                .FirstOrDefaultAsync();
    }

    public async Task<Answer?> GetAsync(int answerId)
    {
        return await _lifeTrackerContext.Answer.FindAsync(answerId);
    }

    public async Task<Answer?> CreateAsync(CreateAnswerDto createAnswerDto)
    {
        // find the Submission and the Question
        Submission? submission = await _lifeTrackerContext.Submission.FindAsync(createAnswerDto.SubmissionId);
        if (submission == null)
        {
            _logger.LogError("No Submission of id {submissionId}", createAnswerDto.SubmissionId);
            return null;
        }

        Question? question = await _lifeTrackerContext.Question.FindAsync(createAnswerDto.QuestionId);
        if (question == null)
        {
            _logger.LogError("No Question of id {questionId}", createAnswerDto.QuestionId);
            return null;
        }

        Answer newAnswer = new Answer
        {
            QuestionId = createAnswerDto.QuestionId,
            SubmissionId = createAnswerDto.SubmissionId,
            Text = createAnswerDto.Text,
            Points = createAnswerDto.Points,
        };

        _lifeTrackerContext.Answer.Add(newAnswer);
        await _lifeTrackerContext.SaveChangesAsync();

        _logger.LogDebug("Created new Answer ${Answer}", newAnswer.ToString());

        return newAnswer;
    }

    public async Task<Answer?> UpdateAsync(int id, UpdateAnswerDto updateAnswerDto)
    {
        try
        {
            Answer? answer = await _lifeTrackerContext.Answer.FindAsync(id);
            if (answer == null)
            {
                _logger.LogError("Could not find answer of id {answer}", id);
                return null;
            }

            answer.Text = updateAnswerDto.Text;
            answer.Points = updateAnswerDto.Points;
            await _lifeTrackerContext.SaveChangesAsync();
            return answer;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Answer Put exception");
            return null;
        }
    }

    /// <summary>
    /// Deletes Answer in its entirety
    /// </summary>
    /// <param name="answerId"></param>
    /// <returns></returns>
    public async Task<bool> DeleteAsync(int answerId)
    {
        Answer? answer = await _lifeTrackerContext.Answer.FindAsync(answerId);
        if (answer == null)
        {
            _logger.LogWarning("Answer could not be found");
            return false;
        }
        else
        {
            _lifeTrackerContext.Remove(answer);

            await _lifeTrackerContext.SaveChangesAsync();

            _logger.LogInformation("Deleted {answer} Answer", answer.ToString());

            return true;
        }
    }
}