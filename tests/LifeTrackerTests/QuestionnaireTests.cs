using NUnit.Framework;
using LifeTracker.Services;
using LifeTracker.Data;
using LifeTracker.Dto;

using Moq;
using NUnit.Framework.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LifeTracker.Models;


namespace LifeTracker.Tests.Services
{
    [TestFixture]
    public class QuestionnaireTests
    {
        private IQuestionnaireService? _service;
        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _logger;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<LifeTrackerContext>()
                                .UseInMemoryDatabase(databaseName: "LifeTrackerTestDb")
                                .Options;
            _context = new LifeTrackerContext(options);

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            var loggerMock = new Mock<ILogger<EFQuestionnaireService>>();
            _logger = loggerMock.Object;

            _service = new EFQuestionnaireService(_context, _logger);
        }

        [Test]
        public async Task CreateAsync_ShouldAddQuestionnaireToDb()
        {
            CreateQuestionnaireDto dto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                CreatedBy = "UnitTester"
            };
            var result = await _service.CreateAsync(dto);

            Assert.That(result, Is.Not.Null);
            Assert.That(dto.Name, Is.EqualTo(result.Name));
            Assert.That(dto.CreatedBy, Is.EqualTo(result.CreatedBy));

            var questionnaireInDb = await _context.Questionnaire.FindAsync(result.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        [Test]
        public async Task UpdateAsync_ShouldUpdateQuestionnaireToDb()
        {

            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                CreatedBy = "UnitTester"
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

            CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                CreatedBy = "UnitTester"
            };
            Questionnaire questionnaire = await _service.CreateAsync(createDto);

            await _service.DeleteAsync(questionnaire.Id);

            var questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb, Is.Null);
        }
    }
}