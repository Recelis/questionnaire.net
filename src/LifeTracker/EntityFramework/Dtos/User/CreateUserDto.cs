namespace LifeTracker.Dto;

public class CreateUserDto
{
    public required string Email { get; set; }

    public string Name { get; set; }

    public required string Password { get; set; }
}
