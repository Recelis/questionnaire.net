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
        private IUserService? _userService;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private IQuestionService? _questionService;

        private LifeTrackerContext? _context;
        private ILogger<EFUserService>? _userLogger;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;
        private ILogger<EFQuestionService>? _questionLogger;

        // Helper functions
        private async Task<User> CreateTestUser(string name = "Test User", string email = "testemail@email.com", string password = "TestPassword123!")
        {
            var dto = new CreateUserDto { Name = name, Email = email, Password = password };
            return await _userService.CreateAsync(dto);
        }
        private async Task<Questionnaire> CreateTestQuestionnaire(int userId = 0, string name = "Test Questionnaire")
        {
            var dto = new CreateQuestionnaireDto { Name = name };
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

            _userLogger = new Mock<ILogger<EFUserService>>().Object;
            _questionnaireLogger = new Mock<ILogger<EFQuestionnaireService>>().Object;
            _templateLogger = new Mock<ILogger<EFTemplateService>>().Object;
            _questionLogger = new Mock<ILogger<EFQuestionService>>().Object;

            _userService = new EFUserService(_context, _userLogger, new Mock<Microsoft.Extensions.Configuration.IConfiguration>().Object);
            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger);
            _templateService = new EFTemplateService(_context, _templateLogger);
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

            User user = await CreateTestUser();
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

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
            User user = await CreateTestUser();
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

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

        [Test]
        public async Task UpdateAsync_ShouldUpdateQuestionToDb()
        {
            // NOTE: this should only be used when the template has not been used.
            User user = await CreateTestUser();
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question = await CreateTestQuestion(template.Id);

            UpdateQuestionDto updateDto = new UpdateQuestionDto
            {
                Text = "Updated Question",
            };
            Question updateQuestion = await _questionService.UpdateAsync(question.Id, updateDto);

            Assert.That(updateQuestion, Is.Not.Null);
            Assert.That(updateQuestion.Text, Is.EqualTo(updateDto.Text));
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteQuestionToDb()
        {
            User user = await CreateTestUser();
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaire.Id);

            Question question = await CreateTestQuestion(template.Id);

            Question questionInDb = await _context.Question.FindAsync(question.Id);

            Assert.That(questionInDb, Is.Not.Null);

            await _questionService.DeleteAsync(question.Id);

            Question deletedQuestionInDb = await _context.Question.FindAsync(question.Id);

            Assert.That(deletedQuestionInDb, Is.Null);

            List<Question> questionsInDb = await _questionService.GetByTemplateAsync(template.Id);

            Assert.That(questionsInDb, Has.Exactly(0).Items);
        }
    }
}