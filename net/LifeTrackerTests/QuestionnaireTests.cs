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
            // Arrange
            User user = await CreateTestUser();

            var dto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
            };
            
            // Act
            var result = await _service.CreateAsync(dto);

            // Assert on returned object
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo(dto.Name));
            Assert.That(result.Id, Is.GreaterThan(0));   // important!

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
        
        public async Task CreateAsync_ShouldPersistQuestionnaireWithTemplate()
        {
            // Arrange
            User user = await CreateTestUser();

            var dto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
            };
            
            // Act
            var result = await _service.CreateAsync(dto);
            await _context.SaveChangesAsync();

            var dto = new CreateTemplateDto { Name = name, QuestionnaireId = result.id };
            await _templateService!.CreateAsync(dto);

            var template = await _context.Template.AddAsync(template);
            await _context.SaveChangesAsync();

            // Act – load with relationship
            var fromDb = await _context.Questionnaire
                .Where(q => q.Id == questionnaire.Id)
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
            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire"
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
                Name = "Test Questionnaire"
            };
            Questionnaire questionnaire = await _service.CreateAsync(createDto);

            await _service.DeleteAsync(questionnaire.Id);

            var questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb, Is.Null);
        }
    }
}