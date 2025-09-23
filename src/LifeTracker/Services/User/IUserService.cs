using LifeTracker.Dto;
using LifeTracker.Models;

namespace LifeTracker.Services;

public interface IUserService
{
    Task<User> Create(CreateUserDto createUserDto);
    Task<string> Login(LoginUserDto loginUserDto);
    Task<User?> GetByIdAsync(int userId);
}