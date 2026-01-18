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
    public class QuestionnaireTests
    {
        private SqliteConnection _connection;

        private IUserService? _userService;

        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private ILogger<EFUserService>? _userLogger;
        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;

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
        private void InitializeServicesWithUser(User user)
        {
            var mockAccessor = CreateMockHttpContextAccessor(user.Id).Object;
            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger, mockAccessor);
        }

        private async Task<User> CreateTestUser(string name = "Test User", string email = "testemail@email.com", string password = "TestPassword123!")
        {
            var dto = new CreateUserDto { Name = name, Email = email, Password = password };
            return await _userService.CreateAsync(dto);
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
            var loggerMock = new Mock<ILogger<EFQuestionnaireService>>();
            
            _questionnaireLogger = loggerMock.Object;

            _userService = new EFUserService(_context, _userLogger, new Mock<Microsoft.Extensions.Configuration.IConfiguration>().Object);

            var templateLogger = new Mock<ILogger<EFTemplateService>>().Object;
            _templateService = new EFTemplateService(_context, templateLogger);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
            _connection.Close();
        }

        [Test]
        public async Task CreateAsync_ShouldAddQuestionnaireToDb()
        {
            // Arrange
            User user = await CreateTestUser();
            InitializeServicesWithUser(user);

            var dto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
            };
            
            // Act
            var result = await _questionnaireService.CreateAsync(dto);

            // Assert on returned object
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo(dto.Name));
            Assert.That(result.Id, Is.GreaterThan(0));

            // Fetch from database with relationships included
            var questionnaireInDb = await _context.Questionnaire
                .Where(q => q.Id == result.Id)
                .Include(q => q.Templates)
                .FirstOrDefaultAsync();

            Assert.That(questionnaireInDb, Is.Not.Null);
            Assert.That(questionnaireInDb.Name, Is.EqualTo(dto.Name));
            Assert.That(questionnaireInDb.UserId, Is.EqualTo(user.Id));

            // Relationship sanity check
            Assert.That(questionnaireInDb.Templates, Is.Not.Null);
            Assert.That(questionnaireInDb.Templates, Is.Empty);
        }
        
        [Test]
        public async Task CreateAsync_ShouldPersistQuestionnaireWithTemplate()
        {
            // Arrange
            User user = await CreateTestUser();
            InitializeServicesWithUser(user);

            var createQuestionnaireDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
            };
            
            // Act
            Questionnaire result = await _questionnaireService.CreateAsync(createQuestionnaireDto);

            var templateDto = new CreateTemplateDto { Name = "Template A", QuestionnaireId = result.Id };
            await _templateService!.CreateAsync(templateDto);


            // Act – load with relationship
            var fromDb = await _context.Questionnaire
                .Where(q => q.Id == result.Id)
                .Include(q => q.Templates)
                .FirstOrDefaultAsync();

            // Assert
            Assert.That(fromDb, Is.Not.Null);
            Assert.That(fromDb.Templates.Count, Is.EqualTo(1));
            Assert.That(fromDb.Templates.First().Name, Is.EqualTo("Template A"));
        }


        [Test]
        public async Task UpdateAsync_ShouldUpdateQuestionnaireToDb()
        {
            User user = await CreateTestUser();
            InitializeServicesWithUser(user);

            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire"
            };
            Questionnaire questionnaire = await _questionnaireService.CreateAsync(createDto);

            UpdateQuestionnaireDto updateDto = new UpdateQuestionnaireDto
            {
                Name = "Updated Questionnaire",
            };
            Questionnaire updatedQuestionnaire = await _questionnaireService.UpdateAsync(questionnaire.Id, updateDto);

            Assert.That(updatedQuestionnaire, Is.Not.Null);
            Assert.That(updatedQuestionnaire.Name, Is.EqualTo(updateDto.Name));

            var questionnaireInDb = await _context.Questionnaire.FindAsync(updatedQuestionnaire.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteQuestionnaireToDb()
        {
            User user = await CreateTestUser();
            InitializeServicesWithUser(user);
            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire"
            };
            Questionnaire questionnaire = await _questionnaireService.CreateAsync(createDto);

            await _questionnaireService.DeleteAsync(questionnaire.Id);

            var questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb, Is.Null);
        }
    }
}