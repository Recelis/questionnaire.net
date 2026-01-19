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
    public class TemplateTests
    {
        private SqliteConnection? _connection;
        private IUserService? _userService;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private LifeTrackerContext? _context;
        private ILogger<EFUserService>? _userLogger;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;

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
            var mockAccessor = CreateMockHttpContextAccessor(user.Id).Object;
            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger, mockAccessor);
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

            _userService = new EFUserService(_context, _userLogger, new Mock<Microsoft.Extensions.Configuration.IConfiguration>().Object);

            if (_userService == null)
                throw new InvalidOperationException("_userService is null");

            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger, new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object);

            if (_questionnaireService == null)
                throw new InvalidOperationException("_questionnaireService is null");

            _templateService = new EFTemplateService(_context, _templateLogger);

            if (_templateService == null)
                throw new InvalidOperationException("_templateService is null");
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
        public async Task CreateAsync_ShouldAddTemplateToDb()
        {
            User user = await CreateTestUser();
            SetServiceWithUserContext(user);
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            CreateTemplateDto createTemplateDto = new CreateTemplateDto
            {
                Name = "Test Template",
                QuestionnaireId = questionnaire.Id
            };

            Template template = await CreateTestTemplate(questionnaireId: questionnaire.Id);

            Assert.That(createTemplateDto, Is.Not.Null);
            Assert.That(createTemplateDto.Name, Is.EqualTo(template.Name));
            Assert.That(createTemplateDto.QuestionnaireId, Is.EqualTo(questionnaire.Id));

            if (_context == null)
                throw new InvalidOperationException("_context is null");
            Questionnaire? questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb?.Templates, Has.Some.Matches<Template>(t => t.Name == "Test Template"));
            Assert.That(questionnaireInDb?.Templates, Has.Exactly(1).Items);
        }

        [Test]
        public async Task UpdateAsync_ShouldUpdateTemplateToDb()
        {

            User user = await CreateTestUser();
            SetServiceWithUserContext(user);
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaireId: questionnaire.Id);

            UpdateTemplateDto updateDto = new UpdateTemplateDto
            {
                Name = "Updated Template",
            };
            if (_templateService == null)
                throw new InvalidOperationException("_templateService is null");
            Template? updateTemplate = await _templateService.UpdateAsync(template.Id, updateDto);

            if (updateTemplate == null)
                throw new InvalidOperationException("Failed to update template");

            Assert.That(updateTemplate, Is.Not.Null);
            Assert.That(updateTemplate.Name, Is.EqualTo(updateDto.Name));

            if (_context == null)
                throw new InvalidOperationException("_context is null");
            var questionnaireInDb = await _context.Questionnaire.FindAsync(template.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteTemplateToDb()
        {
            User user = await CreateTestUser();
            SetServiceWithUserContext(user);
            Questionnaire questionnaire = await CreateTestQuestionnaire(user.Id);

            Template template = await CreateTestTemplate(questionnaireId: questionnaire.Id);

            if (_templateService == null)
                throw new InvalidOperationException("_templateService is null");
            await _templateService.DeleteAsync(template.Id);

            if (_context == null)
                throw new InvalidOperationException("_context is null");
            Template? templateInDb = await _context.Template.FindAsync(template.Id);

            Assert.That(templateInDb, Is.Null);

            Questionnaire? questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb?.Templates, Has.Exactly(0).Items);
        }
    }
}