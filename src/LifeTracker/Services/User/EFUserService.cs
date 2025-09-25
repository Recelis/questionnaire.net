using LifeTracker.Data;
using LifeTracker.Dto;
using LifeTracker.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LifeTracker.Services;

public class EFUserService : IUserService
{
    private readonly LifeTrackerContext _lifeTrackerContext;
    private readonly ILogger<EFUserService> _logger;
    private readonly string _jwtKey;

    public EFUserService(LifeTrackerContext context, ILogger<EFUserService> logger, IConfiguration config)
    {
        _lifeTrackerContext = context;
        _logger = logger;
        _jwtKey = config["Jwt:Key"];
    }

    public async Task<User?> GetAsync(int templateId)
    {
        return await _lifeTrackerContext.User.FindAsync(templateId);
    }

    public async Task<User?> CreateAsync(CreateUserDto createUserDto)
    {
        User newUser = new User
        {
            Email = createUserDto.Email,
            Name = createUserDto.Name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password)

        };

        _logger.LogDebug(newUser.ToString());
        _lifeTrackerContext.User.Add(newUser);

        await _lifeTrackerContext.SaveChangesAsync();
        return newUser;

    }

    public async Task<string> LoginAsync(LoginUserDto loginUserDto)
    {
        var user = await _lifeTrackerContext.User.FirstOrDefaultAsync(u => u.Email == loginUserDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
            return null;

        // Generate JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}