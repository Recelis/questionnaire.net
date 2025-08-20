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
    [TestFixture]
    public class QuestionTests
    {
        private SqliteConnection? _connection;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private IQuestionService? _questionService;

        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;
        private ILogger<EFQuestionService>? _questionLogger;

        // Helper functions
        private async Task<Questionnaire> CreateTestQuestionnaire(string name = "Test Questionnaire", string createdBy = "UnitTester")
        {
            var dto = new CreateQuestionnaireDto { Name = name, CreatedBy = createdBy };
            return await _questionnaireService.CreateAsync(dto);
        }

        private async Task<Template> CreateTestTemplate(int questionnaireId, string name = "Test Template")
        {
            var dto = new CreateTemplateDto { Name = name, QuestionnaireId = questionnaireId };
            return await _templateService.CreateAsync(dto);
        }

        private async Task<Question> CreateTestQuestion(int templateId, string text = "test question")
        {
            var dto = new CreateQuestionDto { Text = text, TemplateId = templateId };
            return await _questionService!.CreateAsync(dto);
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
            _questionLogger = new Mock<ILogger<EFQuestionService>>().Object;

            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger);

            _questionService = new EFQuestionService(_context, _questionLogger);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
            _connection.Close();
        }

        [Test]
        public async Task GetTaskAsync()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template1 = await CreateTestTemplate(questionnaire.Id);

            Template template2 = await CreateTestTemplate(questionnaire.Id);

            Question question1 = await CreateTestQuestion(template1.Id);

            Question question2 = await CreateTestQuestion(template2.Id);

            IList<Question> questionsInDb = await _questionService.GetByTemplateAsync(template1.Id);

            Assert.That(questionsInDb.Count(), Is.EqualTo(1));
            Assert.That(questionsInDb.First().Id, Is.EqualTo(question1.Id));

        }

        [Test]
        public async Task CreateAsync_ShouldAddQuestionToDb()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question = await CreateTestQuestion(template.Id);

            // question is created
            Assert.That(question, Is.Not.Null);
            Assert.That(question.Text, Is.EqualTo("test question"));

            // templateQuestionLink is created
            ICollection<TemplateQuestionLink> templateQuestionLinksInDb = template.TemplateQuestionLinks;
            Assert.That(templateQuestionLinksInDb.Count(), Is.EqualTo(1));
            Assert.That(templateQuestionLinksInDb.First().QuestionId, Is.EqualTo(question.Id));
        }

        // [Test]
        // public async Task UpdateAsync_ShouldUpdateQuestionToDb()
        // {

        //     Questionnaire questionnaire = await CreateTestQuestionnaire();

        //     Question Question = await CreateTestQuestion(questionnaireId: questionnaire.Id);

        //     UpdateQuestionDto updateDto = new UpdateQuestionDto
        //     {
        //         Name = "Updated Question",
        //     };
        //     Question updateQuestion = await _questionService.UpdateAsync(Question.Id, updateDto);

        //     Assert.That(updateQuestion, Is.Not.Null);
        //     Assert.That(updateQuestion.Name, Is.EqualTo(updateDto.Name));

        //     var questionnaireInDb = await _context.Questionnaire.FindAsync(Question.Id);
        //     Assert.That(questionnaireInDb, Is.Not.Null);
        // }

        // [Test]
        // public async Task DeleteAsync_ShouldDeleteQuestionToDb()
        // {
        //     Questionnaire questionnaire = await CreateTestQuestionnaire();

        //     Question Question = await CreateTestQuestion(questionnaireId: questionnaire.Id);

        //     await _questionService.DeleteAsync(Question.Id);

        //     Question QuestionInDb = await _context.Question.FindAsync(Question.Id);

        //     Assert.That(QuestionInDb, Is.Null);

        //     Questionnaire? questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
        //     Assert.That(questionnaireInDb?.Questions, Has.Exactly(0).Items);
        // }
    }
}