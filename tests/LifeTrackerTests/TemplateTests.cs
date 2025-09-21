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
    [TestFixture, Ignore("Ignored while building out models")]
    public class TemplateTests
    {
        private SqliteConnection? _connection;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;

        // Helper functions
        private async Task<Questionnaire> CreateTestQuestionnaire(string name = "Test Questionnaire", int userId = 0)
        {
            var dto = new CreateQuestionnaireDto { Name = name, UserId = userId };
            return await _questionnaireService.CreateAsync(dto);
        }

        private async Task<Template> CreateTestTemplate(int questionnaireId, string name = "Test Template")
        {
            var dto = new CreateTemplateDto { Name = name, QuestionnaireId = questionnaireId };
            return await _templateService!.CreateAsync(dto);
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
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            CreateTemplateDto createTemplateDto = new CreateTemplateDto
            {
                Name = "Test Template",
                QuestionnaireId = questionnaire.Id
            };

            Template template = await CreateTestTemplate(questionnaireId: questionnaire.Id);

            Assert.That(createTemplateDto, Is.Not.Null);
            Assert.That(createTemplateDto.Name, Is.EqualTo(template.Name));
            Assert.That(createTemplateDto.QuestionnaireId, Is.EqualTo(questionnaire.Id));

            Questionnaire? questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb?.Templates, Has.Some.Matches<Template>(t => t.Name == "Test Template"));
            Assert.That(questionnaireInDb?.Templates, Has.Exactly(1).Items);
        }

        [Test]
        public async Task UpdateAsync_ShouldUpdateTemplateToDb()
        {

            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaireId: questionnaire.Id);

            UpdateTemplateDto updateDto = new UpdateTemplateDto
            {
                Name = "Updated Template",
            };
            Template updateTemplate = await _templateService.UpdateAsync(template.Id, updateDto);

            Assert.That(updateTemplate, Is.Not.Null);
            Assert.That(updateTemplate.Name, Is.EqualTo(updateDto.Name));

            var questionnaireInDb = await _context.Questionnaire.FindAsync(template.Id);
            Assert.That(questionnaireInDb, Is.Not.Null);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteTemplateToDb()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaireId: questionnaire.Id);

            await _templateService.DeleteAsync(template.Id);

            Template templateInDb = await _context.Template.FindAsync(template.Id);

            Assert.That(templateInDb, Is.Null);

            Questionnaire? questionnaireInDb = await _context.Questionnaire.FindAsync(questionnaire.Id);
            Assert.That(questionnaireInDb?.Templates, Has.Exactly(0).Items);
        }
    }
}