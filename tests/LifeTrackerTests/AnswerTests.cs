using NUnit.Framework;
using LifeTracker.Services;
using LifeTracker.Data;
using LifeTracker.Dto;

using Moq;
using NUnit.Framework.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LifeTracker.Models;
using Microsoft.Data.Sqlite;

namespace LifeTracker.Tests.Services
{
    [TestFixture, Ignore("Ignored while building out models")]
    public class AnswerTests
    {
        private SqliteConnection? _connection;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private ISubmissionService? _submissionService;
        private IQuestionService? _questionService;
        private IAnswerService? _answerService;

        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;
        private ILogger<EFSubmissionService>? _submissionLogger;
        private ILogger<EFQuestionService>? _questionLogger;
        private ILogger<EFAnswerService>? _answerLogger;

        // Helper functions
        private async Task<Questionnaire> CreateTestQuestionnaire(string name = "Test Questionnaire", int userId = 0)
        {
            var dto = new CreateQuestionnaireDto { Name = name, UserId = userId };
            return await _questionnaireService.CreateAsync(dto);
        }

        private async Task<Template> CreateTestTemplate(int questionnaireId, string name = "Test Template")
        {
            var dto = new CreateTemplateDto { Name = name, QuestionnaireId = questionnaireId };
            return await _templateService!.CreateAsync(dto);
        }

        private async Task<Question> CreateTestQuestion(int templateId, string text = "test question")
        {
            var dto = new CreateQuestionDto { Text = text, TemplateId = templateId };
            return await _questionService!.CreateAsync(dto);
        }

        private async Task<Submission> CreateTestSubmission(int templateId, int userId = 0)
        {
            var dto = new CreateSubmissionDto { TemplateId = templateId, UserId = userId };
            return await _submissionService!.CreateAsync(dto);
        }

        private async Task<Answer> CreateTestAnswer(CreateAnswerDto dto)
        {
            return await _answerService!.CreateAsync(dto);
        }

        [SetUp]
        public void Setup()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            var options = new DbContextOptionsBuilder<LifeTrackerContext>()
                .UseSqlite(_connection)
                .Options;
            _context = new LifeTrackerContext(options);

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            _questionnaireLogger = new Mock<ILogger<EFQuestionnaireService>>().Object;
            _templateLogger = new Mock<ILogger<EFTemplateService>>().Object;
            _questionLogger = new Mock<ILogger<EFQuestionService>>().Object;
            _submissionLogger = new Mock<ILogger<EFSubmissionService>>().Object;
            _answerLogger = new Mock<ILogger<EFAnswerService>>().Object;

            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger);
            _templateService = new EFTemplateService(_context, _templateLogger);
            _questionService = new EFQuestionService(_context, _questionLogger);
            _submissionService = new EFSubmissionService(_context, _submissionLogger);
            _answerService = new EFAnswerService(_context, _answerLogger);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
            _connection.Close();
        }

        [Test]
        public async Task CreateAsync_ShouldAddAnswerToDb()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question = await CreateTestQuestion(template.Id);

            Submission submission = await CreateTestSubmission(template.Id);

            CreateAnswerDto createAnswerDto = new CreateAnswerDto
            {
                QuestionId = question.Id,
                SubmissionId = submission.Id,
                Text = "My Answer",
                Points = 1
            };

            Answer answer = await CreateTestAnswer(createAnswerDto);

            Assert.That(answer, Is.Not.Null);

            Assert.That(createAnswerDto.SubmissionId, Is.EqualTo(answer.SubmissionId));
            Assert.That(createAnswerDto.QuestionId, Is.EqualTo(answer.QuestionId));
            Assert.That(createAnswerDto.Text, Is.EqualTo(answer.Text));
            Assert.That(createAnswerDto.Points, Is.EqualTo(answer.Points));

            Submission? submissionInDb = await _context.Submission.FindAsync(questionnaire.Id);
            Assert.That(submissionInDb?.Answers.Count(), Is.EqualTo(1));
        }

        [Test]
        public async Task UpdateAsync_ShouldUpdateAnswer()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question = await CreateTestQuestion(template.Id);

            Submission submission = await CreateTestSubmission(template.Id);

            CreateAnswerDto createAnswerDto = new CreateAnswerDto
            {
                QuestionId = question.Id,
                SubmissionId = submission.Id,
                Text = "My Answer",
                Points = 1
            };

            Answer answer = await CreateTestAnswer(createAnswerDto);

            UpdateAnswerDto updateAnswerDto = new UpdateAnswerDto
            {
                Text = "My New Answer",
                Points = 2
            };

            Answer updatedAnswer = await _answerService!.UpdateAsync(answer.Id, updateAnswerDto);

            Assert.That(answer, Is.Not.Null);

            Assert.That(createAnswerDto.SubmissionId, Is.EqualTo(updatedAnswer.SubmissionId));
            Assert.That(createAnswerDto.QuestionId, Is.EqualTo(updatedAnswer.QuestionId));
            Assert.That(updateAnswerDto.Text, Is.EqualTo(updatedAnswer.Text));
            Assert.That(updateAnswerDto.Points, Is.EqualTo(updatedAnswer.Points));
        }

        // [Test]
        public async Task GetByUserAsync_ShouldGetOnlySubmissionAnswers()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question0 = await CreateTestQuestion(template.Id, "Question 0");

            Question question1 = await CreateTestQuestion(template.Id, "Question 1");

            Submission submission0 = await CreateTestSubmission(template.Id);

            Submission submission1 = await CreateTestSubmission(template.Id);

            CreateAnswerDto createAnswerDto0 = new CreateAnswerDto
            {
                QuestionId = question0.Id,
                SubmissionId = submission0.Id,
                Text = "My Answer 0",
                Points = 1
            };

            CreateAnswerDto createAnswerDto1 = new CreateAnswerDto
            {
                QuestionId = question1.Id,
                SubmissionId = submission0.Id,
                Text = "My Answer 1",
                Points = 1
            };

            CreateAnswerDto createOtherSubmissionAnswerDto0 = new CreateAnswerDto
            {
                QuestionId = question0.Id,
                SubmissionId = submission1.Id,
                Text = "My Answer 1",
                Points = 1
            };

            await CreateTestAnswer(createAnswerDto0);
            await CreateTestAnswer(createAnswerDto1);
            await CreateTestAnswer(createOtherSubmissionAnswerDto0);

            List<Answer> answersInDb = await _answerService.GetBySubmissionAsync(submission0.Id);

            Assert.That(answersInDb, Has.Exactly(1).Items);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteAnswerToDb()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question = await CreateTestQuestion(template.Id);

            Submission submission = await CreateTestSubmission(template.Id);

            CreateAnswerDto createAnswerDto = new CreateAnswerDto
            {
                QuestionId = question.Id,
                SubmissionId = submission.Id,
                Text = "My Answer",
                Points = 1
            };

            Answer answer = await CreateTestAnswer(createAnswerDto);

            await _answerService.DeleteAsync(answer.Id);

            Assert.That(answer, Is.Not.Null);
            Submission? submissionInDb = await _context.Submission.FindAsync(questionnaire.Id);
            Assert.That(submissionInDb?.Answers, Has.Exactly(0).Items);
        }
    }
}