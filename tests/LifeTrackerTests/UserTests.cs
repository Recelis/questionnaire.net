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
using Microsoft.Extensions.Configuration;

namespace LifeTracker.Tests.Services
{

    [TestFixture]
    public class UserTests
    {
        private SqliteConnection? _connection;
        private IUserService? _userService;
        private LifeTrackerContext? _context;
        private ILogger<EFUserService>? _userLogger;

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

            var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string>
            {
                { "Jwt:Key", "test_secret_key_1234567890111213141516" }
            })
            .Build();


            _userService = new EFUserService(_context, _userLogger, config);
        }

        [Test]
        public async Task CreateAndLoginAsync__ShouldAddUserToDb()
        {
            var createUserDto = new CreateUserDto
            {
                Name = "alice",
                Email = "alice@example.com",
                Password = "SuperSecure123!"
            };

            User user = await _userService.CreateAsync(createUserDto);

            Assert.That(user.Id, Is.GreaterThan(0));
            Assert.That(user.PasswordHash, Is.Not.EqualTo(createUserDto.Password));

            var token = await _userService.LoginAsync(new LoginUserDto
            {
                Email = "alice@example.com",
                Password = "SuperSecure123!"
            });

            Assert.That(token, Is.Not.Null);
        }

        [Test]
        public async Task Login_Should_Fail_With_Wrong_Password()
        {
            var user = await _userService.CreateAsync(new CreateUserDto
            {
                Name = "bob",
                Email = "bob@example.com",
                Password = "Password1!"
            });

            var token = await _userService.LoginAsync(new LoginUserDto
            {
                Email = "bob@example.com",
                Password = "WrongPassword!"
            });

            Assert.That(token, Is.Null);
        }
    }
}