using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IUserService
{
    Task<User> CreateAsync(CreateUserDto createUserDto);
    Task<string?> LoginAsync(LoginUserDto loginUserDto);
    Task<User?> GetAsync(int userId);
}