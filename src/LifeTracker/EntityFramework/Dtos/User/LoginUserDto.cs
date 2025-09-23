namespace LifeTracker.Dto;

public class LoginUserDto
{
    public required int EmailAddress { get; set; }

    public required string PasswordHash { get; set; }
}
