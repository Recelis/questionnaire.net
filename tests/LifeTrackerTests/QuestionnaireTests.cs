using NUnit.Framework;
using System.Collections.Generic;
using LifeTracker.Services;
using LifeTracker.Data;
using NUnit.Framework.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeTrackerTests.Services
{
    [TestFixture]
    public class QuestionnaireTests
    {
        private IQuestionnaireService _service;
        private LifeTrackerContext _context;
        private ILogger<InMemoryQuestionnaireService> _logger;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<LifeTrackerContext>();

        }

        [Test]
        public void Test1()
        {
            Assert.Pass();
        }
    }
}