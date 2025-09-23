namespace LifeTracker.Dto;

public class CreateUserDto
{
    public required int EmailAddress { get; set; }

    public int Name { get; set; }

    public required string PasswordHash { get; set; }
}
