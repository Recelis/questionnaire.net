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
            if (_userService == null)
                throw new InvalidOperationException("_userService is null");
            var result = await _userService.CreateAsync(dto);
            if (result == null)
                throw new InvalidOperationException("Failed to create test user");
            return result;
        }
        private async Task<Questionnaire> CreateTestQuestionnaire(int userId = 0, string name = "Test Questionnaire")
        {
            var dto = new CreateQuestionnaireDto { Name = name };
            if (_questionnaireService == null)
                throw new InvalidOperationException("_questionnaireService is null");
            var result = await _questionnaireService.CreateAsync(dto);
            if (result == null)
                throw new InvalidOperationException("Failed to create test questionnaire");
            return result;
        }

        private async Task<Template> CreateTestTemplate(int questionnaireId, string name = "Test Template")
        {
            var dto = new CreateTemplateDto { Name = name, QuestionnaireId = questionnaireId };
            if (_templateService == null)
                throw new InvalidOperationException("_templateService is null");
            var result = await _templateService.CreateAsync(dto);
            if (result == null)
                throw new InvalidOperationException("Failed to create test template");
            return result;
        }

        private async Task<Submission> CreateTestSubmission(int userId = 0, int templateId = 0)
        {
            var dto = new CreateSubmissionDto { TemplateId = templateId };
            if (_submissionService == null)
                throw new InvalidOperationException("_submissionService is null");
            var result = await _submissionService.CreateAsync(dto);
            if (result == null)
                throw new InvalidOperationException("Failed to create test submission");
            return result;
        }

        // Helper to create a mock HttpContextAccessor with a specific user ID
        private static Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor> CreateMockHttpContextAccessor(int userId)
        {
            var mockHttpContextAccessor = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
            var mockHttpContext = new Mock<Microsoft.AspNetCore.Http.HttpContext>();
            var mockUser = new Mock<System.Security.Claims.ClaimsPrincipal>();
            mockUser.Setup(u => u.FindFirst("id")).Returns(new System.Security.Claims.Claim("id", userId.ToString()));
            mockHttpContext.Setup(c => c.User).Returns(mockUser.Object);
            mockHttpContextAccessor.Setup(a => a.HttpContext).Returns(mockHttpContext.Object);
            return mockHttpContextAccessor;
        }

        // Helper to initialize services with a specific user
        private void SetServiceWithUserContext(User user)
        {
            if (_context == null)
                throw new InvalidOperationException("_context is null");
            if (_questionnaireLogger == null)
                throw new InvalidOperationException("_questionnaireLogger is null");
            if (_submissionLogger == null)
                throw new InvalidOperationException("_submissionLogger is null");
            var mockAccessor = CreateMockHttpContextAccessor(user.Id).Object;
            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger, mockAccessor);
            _submissionService = new EFSubmissionService(_context, _submissionLogger, mockAccessor);
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

            if (_context == null)
                throw new InvalidOperationException("_context is null");

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            _userLogger = new Mock<ILogger<EFUserService>>().Object;
            _questionnaireLogger = new Mock<ILogger<EFQuestionnaireService>>().Object;
            _templateLogger = new Mock<ILogger<EFTemplateService>>().Object;
            _submissionLogger = new Mock<ILogger<EFSubmissionService>>().Object;

            _userService = new EFUserService(_context, _userLogger, new Mock<Microsoft.Extensions.Configuration.IConfiguration>().Object);

            if (_userService == null)
                throw new InvalidOperationException("_userService is null");

            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger, new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object);

            if (_questionnaireService == null)
                throw new InvalidOperationException("_questionnaireService is null");

            _templateService = new EFTemplateService(_context, _templateLogger);

            if (_templateService == null)
                throw new InvalidOperationException("_templateService is null");

            _submissionService = new EFSubmissionService(_context, _submissionLogger, new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object);

            if (_submissionService == null)
                throw new InvalidOperationException("_submissionService is null");
        }

        [TearDown]
        public void TearDown()
        {
            if (_context != null)
                _context.Dispose();
            if (_connection != null)
                _connection.Close();
        }

        [Test]
        public async Task CreateAsync_ShouldAddSubmissionToDb()
        {
            User user = await CreateTestUser();
            SetServiceWithUserContext(user);
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
            SetServiceWithUserContext(user0);
            Questionnaire questionnaire = await CreateTestQuestionnaire(user0.Id);
            Template template = await CreateTestTemplate(questionnaire.Id);

            User user1 = await CreateTestUser("Test User 2", "testuser2@email.com");
            SetServiceWithUserContext(user1);
            Questionnaire questionnaire1 = await CreateTestQuestionnaire(user1.Id);
            Template template1 = await CreateTestTemplate(questionnaire1.Id);

            SetServiceWithUserContext(user0);
            await CreateTestSubmission(user0.Id, template.Id);
            await CreateTestSubmission(user0.Id, template.Id);
            
            SetServiceWithUserContext(user1);
            await CreateTestSubmission(user1.Id, template1.Id);

            SetServiceWithUserContext(user0);
            if (_submissionService == null)
                throw new InvalidOperationException("_submissionService is null");
            List<Submission> submissionsInDb = await _submissionService.GetByUserAsync(user0.Id);

            Assert.That(submissionsInDb, Has.Exactly(2).Items);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteSubmissionToDb()
        {
            User user = await CreateTestUser();
            SetServiceWithUserContext(user);
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaire.Id);

            Submission submission = await CreateTestSubmission(user.Id, template.Id);

            if (_submissionService == null)
                throw new InvalidOperationException("_submissionService is null");
            await _submissionService.DeleteAsync(submission.Id);

            if (_context == null)
                throw new InvalidOperationException("_context is null");
            Submission? submissionInDb = await _context.Submission.FindAsync(submission.Id);

            Assert.That(submissionInDb, Is.Null);
        }
    }
}