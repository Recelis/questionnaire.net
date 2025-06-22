using LifeTracker.Data;
using LifeTracker.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<LifeTrackerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .UseSnakeCaseNamingConvention());

builder.Services.AddScoped<IQuestionnaireService, EFQuestionnaireService>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LifeTrackerContext>();

    if (await dbContext.Database.CanConnectAsync())
    {
        Console.WriteLine("✅ Successfully connected to Postgres.");
    }
    else
    {
        Console.WriteLine("❌ Failed to connect to Postgres.");
    }
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();