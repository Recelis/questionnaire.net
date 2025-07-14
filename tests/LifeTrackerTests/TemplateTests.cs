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
        private SqliteConnection _connection;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;

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

            _questionnaireService = new EFQuestionnaireService(_context, _questionnaireLogger);

            _templateService = new EFTemplateService(_context, _templateLogger);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
            _connection.Close();
        }

        [Test]
        public async Task CreateAsync_ShouldAddTemplateToDb()
        {
            CreateQuestionnaireDto createQuestionnaireDto = new CreateQuestionnaireDto
            {
                Name = "Test Questionnaire",
                CreatedBy = "UnitTester"
            };
            Questionnaire questionnaire = await _questionnaireService.CreateAsync(createQuestionnaireDto);

            CreateTemplateDto createTemplateDto = new CreateTemplateDto
            {
                Name = "Test Template",
                QuestionnaireId = questionnaire.Id
            };

            Template template = await _templateService.CreateAsync(createTemplateDto);

            Assert.That(createTemplateDto, Is.Not.Null);
            Assert.That(createTemplateDto.Name, Is.EqualTo(template.Name));
            Assert.That(createTemplateDto.QuestionnaireId, Is.EqualTo(questionnaire.Id));

            var questionnaireInDb = await _context.Questionnaire.FindAsync(template.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        // [Test]
        // public async Task UpdateAsync_ShouldUpdateQuestionnaireToDb()
        // {

        //     CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
        //     {
        //         Name = "Test Questionnaire",
        //         CreatedBy = "UnitTester"
        //     };
        //     Questionnaire questionnaire = await _service.CreateAsync(createDto);

        //     UpdateQuestionnaireDto updateDto = new UpdateQuestionnaireDto
        //     {
        //         Name = "Updated Questionnaire",
        //     };
        //     Questionnaire updatedQuestionnaire = await _service.UpdateAsync(questionnaire.Id, updateDto);

        //     Assert.That(updatedQuestionnaire, Is.Not.Null);
        //     Assert.That(updatedQuestionnaire.Name, Is.EqualTo(updateDto.Name));

        //     var questionnaireInDb = await _context.Questionnaire.FindAsync(updatedQuestionnaire.Id);
        //     Assert.That(questionnaireInDb, Is.Not.Null);
        // }

        // [Test]
        // public async Task DeleteAsync_ShouldDeleteQuestionnaireToDb()
        // {

        //     CreateQuestionnaireDto createDto = new CreateQuestionnaireDto
        //     {
        //         Name = "Test Questionnaire",
        //         CreatedBy = "UnitTester"
        //     };
        //     Questionnaire questionnaire = await _service.CreateAsync(createDto);

        //     await _service.DeleteAsync(questionnaire.Id);

        //     var questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
        //     Assert.That(questionnaireInDb, Is.Null);
        // }
    }
}