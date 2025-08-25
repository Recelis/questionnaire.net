using LifeTracker.Data;
using LifeTracker.Dto;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeTracker.Services;

public class EFQuestionService : IQuestionService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFQuestionService> _logger;

    public EFQuestionService(LifeTrackerContext context, ILogger<EFQuestionService> logger)
    {
        _lifeTrackerContext = context;
        _logger = logger;
    }

    public async Task<List<Question>> GetByTemplateAsync(int templateId)
    {
        return await _lifeTrackerContext.Template
                .Where(t => t.Id == templateId)
                .Include(t => t.TemplateQuestionLinks)
                .ThenInclude(tql => tql.Question)
                .SelectMany(t => t.TemplateQuestionLinks.Select(tql => tql.Question))
                .ToListAsync();
    }

    public async Task<Question?> GetAsync(int questionId)
    {
        return await _lifeTrackerContext.Question.FindAsync(questionId);
    }

    public async Task<Question?> CreateAsync(CreateQuestionDto createQuestionDto)
    {
        // find the Template first
        Template? template = await _lifeTrackerContext.Template.FindAsync(createQuestionDto.TemplateId);
        if (template == null)
        {
            _logger.LogError("No Template of id {questionnaire}", createQuestionDto.TemplateId);
            return null;
        }

        using var transaction = await _lifeTrackerContext.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

        // create question with the questionNumber the next highest questionNumber value within the questions returned from the templateQuestionLinks

        // find the latest QuestionNumber scoped to the Template. 
        int latestQuestionScopedToTemplate = await _lifeTrackerContext.TemplateQuestionLink
            .Where(t => t.TemplateId == createQuestionDto.TemplateId)
            .MaxAsync(tql => (int?)tql.QuestionNumber) ?? 0;

        Question newQuestion = new Question
        {
            Text = createQuestionDto.Text,
        };

        _lifeTrackerContext.Question.Add(newQuestion);
        await _lifeTrackerContext.SaveChangesAsync();

        // create a new templateQuestionLink
        TemplateQuestionLink newTemplateQuestionLink = new TemplateQuestionLink
        {
            TemplateId = createQuestionDto.TemplateId,
            QuestionNumber = latestQuestionScopedToTemplate + 1,
            QuestionId = newQuestion.Id
        };


        _logger.LogDebug("Created new Question", newQuestion.ToString());
        _logger.LogDebug("Created new TemplateQuestionLink", newTemplateQuestionLink.ToString());

        _lifeTrackerContext.TemplateQuestionLink.Add(newTemplateQuestionLink);
        await _lifeTrackerContext.SaveChangesAsync();

        await transaction.CommitAsync();
        return newQuestion;
    }

    public async Task<Question?> UpdateAsync(int id, UpdateQuestionDto updateQuestionDto)
    {
        try
        {
            Question? question = await _lifeTrackerContext.Question.FindAsync(id);
            if (question == null)
            {
                _logger.LogError("Could not find question of id {question}", id);
                return null;
            }

            question.Text = updateQuestionDto.Text;
            await _lifeTrackerContext.SaveChangesAsync();
            return question;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Question Put exception");
            return null;
        }
    }

    public async Task<bool> DeleteAsync(int questionId)
    {
        Question? question = await _lifeTrackerContext.Question.FindAsync(questionId);
        if (question == null)
        {
            _logger.LogWarning("Question could not be found");
            return false;
        }
        else
        {
            using var transaction = await _lifeTrackerContext.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            _lifeTrackerContext.Remove(question);

            await _lifeTrackerContext.SaveChangesAsync();
            // remove template from Questionnaire
            int numDeleted = await _lifeTrackerContext.TemplateQuestionLink
                .Where(tql => tql.QuestionId == question.Id)
                .ExecuteDeleteAsync();
            await transaction.CommitAsync();
            if (numDeleted == 0)
            {
                _logger.LogError("No templateQuestionLinks with {id} could be found", question.Id);
            }
            else
            {
                _logger.LogInformation("Deleted {numDeleted} templateQuestionLinks", numDeleted);
            }

            return true;
        }
    }
}