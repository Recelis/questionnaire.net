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

        private IQuestionnaireService? _service;
        private ILogger<EFUserService>? _userLogger;
        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _logger;

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
            _logger = loggerMock.Object;

            _userService = new EFUserService(_context, _userLogger, new Mock<Microsoft.Extensions.Configuration.IConfiguration>().Object);
            _service = new EFQuestionnaireService(_context, _logger);
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
            User user = await CreateTestUser();
            CreateQuestionnaireDto dto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                UserId = user.Id
            };
            var result = await _service.CreateAsync(dto);

            Assert.That(result, Is.Not.Null);
            Assert.That(dto.Name, Is.EqualTo(result.Name));
            Assert.That(dto.UserId, Is.EqualTo(result.UserId));

            var questionnaireInDb = await _context.Questionnaire.FindAsync(result.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        [Test]
        public async Task UpdateAsync_ShouldUpdateQuestionnaireToDb()
        {
            User user = await CreateTestUser();
            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                UserId = user.Id
            };
            Questionnaire questionnaire = await _service.CreateAsync(createDto);

            UpdateQuestionnaireDto updateDto = new UpdateQuestionnaireDto
            {
                Name = "Updated Questionnaire",
            };
            Questionnaire updatedQuestionnaire = await _service.UpdateAsync(questionnaire.Id, updateDto);

            Assert.That(updatedQuestionnaire, Is.Not.Null);
            Assert.That(updatedQuestionnaire.Name, Is.EqualTo(updateDto.Name));

            var questionnaireInDb = await _context.Questionnaire.FindAsync(updatedQuestionnaire.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteQuestionnaireToDb()
        {
            User user = await CreateTestUser();
            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                UserId = user.Id
            };
            Questionnaire questionnaire = await _service.CreateAsync(createDto);

            await _service.DeleteAsync(questionnaire.Id);

            var questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb, Is.Null);
        }
    }
}