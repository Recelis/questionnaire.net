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
    public class SubmissionTests
    {
        private SqliteConnection? _connection;
        private IUserService? _userService;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private ISubmissionService? _submissionService;
        private LifeTrackerContext? _context;
        private ILogger<EFUserService>? _userLogger;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;
        private ILogger<EFSubmissionService>? _submissionLogger;

        // Helper functions
        private async Task<User> CreateTestUser(string name = "Test User", string email = "testemail@email.com", string password = "TestPassword123!")
        {
            var dto = new CreateUserDto { Name = name, Email = email, Password = password };
            return await _userService.CreateAsync(dto);
        }
        private async Task<Questionnaire> CreateTestQuestionnaire(int userId = 0, string name = "Test Questionnaire")
        {
            var dto = new CreateQuestionnaireDto { Name = name, UserId = userId };
            return await _questionnaireService.CreateAsync(dto);
        }

        private async Task<Template> CreateTestTemplate(int questionnaireId, string name = "Test Template")
        {
            var dto = new CreateTemplateDto { Name = name, QuestionnaireId = questionnaireId };
            return await _templateService!.CreateAsync(dto);
        }

        private async Task<Submission> CreateTestSubmission(int userId = 0, int templateId = 0)
        {
            var dto = new CreateSubmissionDto { TemplateId = templateId, UserId = userId };
            return await _submissionService!.CreateAsync(dto);
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
            _submissionLogger = new Mock<ILogger<EFSubmissionService>>().Object;

            _userService = new EFUserService(_context, _userLogger, new Mock<Microsoft.Extensions.Configuration.IConfiguration>().Object);
            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger);
            _templateService = new EFTemplateService(_context, _templateLogger);
            _submissionService = new EFSubmissionService(_context, _submissionLogger);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
            _connection.Close();
        }

        [Test]
        public async Task CreateAsync_ShouldAddSubmissionToDb()
        {
            User user = await CreateTestUser();
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaire.Id);

            CreateSubmissionDto createSubmissionDto = new CreateSubmissionDto
            {
                TemplateId = template.Id
            };

            Submission submission = await CreateTestSubmission(user.Id, template.Id);

            Assert.That(submission, Is.Not.Null);

            Assert.That(createSubmissionDto.TemplateId, Is.EqualTo(submission.TemplateId));
        }

        [Test]
        public async Task GetByUserAsync_ShouldGetOnlyUserOwnedSubmissions()
        {
            User user0 = await CreateTestUser();
            User user1 = await CreateTestUser("Test User 2", "testuser2@email.com");
            Questionnaire questionnaire = await CreateTestQuestionnaire(user0.Id);
            Template template = await CreateTestTemplate(questionnaire.Id);

            Questionnaire questionnaire1 = await CreateTestQuestionnaire(user1.Id);
            Template template1 = await CreateTestTemplate(questionnaire1.Id);

            await CreateTestSubmission(user0.Id, template.Id);
            await CreateTestSubmission(user0.Id, template.Id);
            await CreateTestSubmission(user1.Id, template1.Id);

            List<Submission> submissionsInDb = await _submissionService.GetByUserAsync(user0.Id);

            Assert.That(submissionsInDb, Has.Exactly(2).Items);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteSubmissionToDb()
        {
            User user = await CreateTestUser();
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaire.Id);

            Submission submission = await CreateTestSubmission(user.Id, template.Id);

            await _submissionService.DeleteAsync(submission.Id);

            Submission submissionInDb = await _context.Submission.FindAsync(submission.Id);

            Assert.That(submissionInDb, Is.Null);
        }
    }
}