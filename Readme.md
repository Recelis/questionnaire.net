# Questionnaire.Net

## Tasks

- [x] - Create app
- [x] - Look into MVC pattern
- [x] - Connect to Postgres Database
- [x] - Design models
- [x] - CRUD Questionnaire model
- [ ] - CRUD Template model
- [ ] - Setup NUnit tests
- [ ] - Create User model + add to Questionnaire created_by field.
- [ ] - Seed User
- [ ] - CRUD Question
- [ ] - CRUD Submission
- [ ] - CRUD Answer

## Migrations

### Adding a new Migration

```bash
dotnet ef migrations add MigrationName
```

### Applying Migrations

Update Entity Framework Core migrations.

```bash
dotnet ef database update
```

### Testing Migrations

If you want to just create a test migration without applying it, you can use the `--output-dir` command.

```bash
dotnet ef migrations add TempMigrationPreview --output-dir Migrations/Temp

# To remove unapplied migrations
dotnet ef migrations remove
```

# Tutorials This was Built From

https://learn.microsoft.com/en-us/training/modules/build-web-api-aspnet-core/
https://learn.microsoft.com/en-us/aspnet/core/data/ef-mvc/intro?view=aspnetcore-9.0
https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-9.0&tabs=visual-studio-code
