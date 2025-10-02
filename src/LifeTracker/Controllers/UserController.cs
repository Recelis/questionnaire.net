using Microsoft.AspNetCore.Mvc;
using LifeTracker.Models;
using LifeTracker.Services;
using System.Text.Json;
using LifeTracker.Dto;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{

    private readonly IUserService _userService;

    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Gets a user
    /// </summary>
    /// <returns>A User.</returns>
    /// <response code="200">Returns the User</response>
    /// <response code="404">if no user found</response>
    [HttpGet("{userId:int}")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<ActionResult<User?>> Get(int userId)
    {
        _logger.LogInformation("Getting user");
        User? user = await _userService.GetAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="createUserDto"></param>
    /// <response code="201">Returns the created user</response>
    [HttpPost()]
    [ProducesResponseType(typeof(User), StatusCodes.Status201Created)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<User>> Post(CreateUserDto createUserDto)
    {
        _logger.LogInformation("Creating new user: {User}", JsonSerializer.Serialize(createUserDto));
        User? user = await _userService.CreateAsync(createUserDto);

        if (user == null)
        {
            return NotFound();
        }

        return CreatedAtAction(nameof(Get), new { userId = user.Id }, user);
    }

    /// <summary>
    /// logins the user
    /// </summary>
    /// <param name="loginUserDto"></param>
    /// <response code="200">Returns a token</response>
    /// <response code="404">If the user doesn't exists</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<string?>> Login(int id, [FromBody] LoginUserDto loginUserDto)
    {
        _logger.LogInformation("Logging in user: {User}", loginUserDto);
        string? token = await _userService.LoginAsync(loginUserDto);
        if (token == null)
        {
            _logger.LogInformation("user credentials {Email} were incorrect", loginUserDto.Email);
            return Unauthorized();
        }

        return Ok(token);
    }
}
