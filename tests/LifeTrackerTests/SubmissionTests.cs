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
    public class SubmissionTests
    {
        private SqliteConnection? _connection;
        private IQuestionnaireService? _questionnaireService;
        private ITemplateService? _templateService;
        private ISubmissionService? _submissionService;
        private LifeTrackerContext? _context;
        private ILogger<EFQuestionnaireService>? _questionnaireLogger;
        private ILogger<EFTemplateService>? _templateLogger;
        private ILogger<EFSubmissionService>? _submissionLogger;

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

        private async Task<Submission> CreateTestSubmission(int templateId, int userId = 0)
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

            _questionnaireLogger = new Mock<ILogger<EFQuestionnaireService>>().Object;
            _templateLogger = new Mock<ILogger<EFTemplateService>>().Object;
            _submissionLogger = new Mock<ILogger<EFSubmissionService>>().Object;

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
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            CreateSubmissionDto createSubmissionDto = new CreateSubmissionDto
            {
                TemplateId = template.Id
            };

            Submission submission = await CreateTestSubmission(template.Id);

            Assert.That(submission, Is.Not.Null);

            Assert.That(createSubmissionDto.TemplateId, Is.EqualTo(submission.TemplateId));
        }

        [Test]
        public async Task GetByUserAsync_ShouldGetOnlyUserOwnedSubmissions()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            int userId0 = 0;
            int userId1 = 1;

            await CreateTestSubmission(template.Id, userId0);
            await CreateTestSubmission(template.Id, userId0);
            await CreateTestSubmission(template.Id, userId1);

            List<Submission> submissionsInDb = await _submissionService.GetByUserAsync(userId0);

            Assert.That(submissionsInDb, Has.Exactly(2).Items);
        }

        [Test]
        public async Task DeleteAsync_ShouldDeleteSubmissionToDb()
        {
            Questionnaire questionnaire = await CreateTestQuestionnaire();

            Template template = await CreateTestTemplate(questionnaire.Id);

            CreateSubmissionDto createSubmissionDto = new CreateSubmissionDto
            {
                TemplateId = template.Id
            };

            Submission submission = await CreateTestSubmission(template.Id);

            await _submissionService.DeleteAsync(submission.Id);

            Submission submissionInDb = await _context.Submission.FindAsync(submission.Id);

            Assert.That(submissionInDb, Is.Null);
        }
    }
}