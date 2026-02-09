# Questionnaire.Net

## Tasks

- [x] - Create app
- [x] - Look into MVC pattern
- [x] - Connect to Postgres Database
- [x] - Design models
- [x] - CRUD Questionnaire model
- [x] - CRUD Template model
- [x] - Setup NUnit tests
- [x] - CRUD TemplateQuestionLink + Question
- [x] - CRUD Submission
- [x] - CRUD Answer
- [x] - Create User model + add to Questionnaire created_by field.
- [ ] - Locking templates so cannot have answers until it is 'locked'. Cannot modify after locked.
- [ ] - - Cannot make submissions if not locked if only one template
- [ ] - - Submissions are for previous locked template, if latest if unlocked
- [ ] - - cannot create a new template if latest is unlocked
- [ ] - duplicating templates
- [ ] - Submission points are added up over week/month/year dashboards

### Future

#### Electron Project

- [x] - Setup Electron project
- [x] - Users can log in
- [x] - Users can create their own Questionnaires
- [x] - Users can create their own Templates
- [x] - Users can add questions to their templates
- [ ] - Users can duplicate their templates
- [x] - Users can create submissions
- [x] - Users can add answers to their submissions
- [ ] - Export electron project
- [ ] - Dashboard page for week
- [ ] - Dashboard for month
- [ ] - Dashboard for year

#### Deployments

- [ ] - Setup CI on GitHub Actions
- [ ] - Put Dotnet Project onto Lambda
- [ ] - Connect to Postgres Database online
- [ ] - Connect local running Electron Project to Dotnet Lambda
- [ ] - Setup CD on GitHub Actions

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

You have to make sure that your Snapshot also reverted.

### to restart from scratch

Only do this if you are not in production.

```bash
dotnet ef database drop
dotnet ef database update
```

Otherwise, you can unapply the latest migration with:

```bash
dotnet ef database update <PreviousMigrationName>

# then remove your latest migration
dotnet ef database remove <PreviousMigrationName>
```

# Tutorials This was Built From

https://learn.microsoft.com/en-us/training/modules/build-web-api-aspnet-core/
https://learn.microsoft.com/en-us/aspnet/core/data/ef-mvc/intro?view=aspnetcore-9.0
https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-9.0&tabs=visual-studio-code

# Running

Before you start:

```bash
dotnet clean # only if you messed up your environment
dotnet restore
dotnet build
```

To run LifeTracker from root.

```bash
dotnet run --project LifeTracker
```

You can also cd into the LifeTracker project folder and run:

```bash
dotnet run
```

To run the tests, go to LifeTrackerTest.

```bash
dotnet test
```

For running a particular test suit:

```bash
dotnet test --filter "AnswerTests"
```

For running just one test:

```bash
dotnet test --filter "FullyQualifiedName=LifeTracker.Tests.Services.AnswerTests.CreateAsync_ShouldAddAnswerToDb"
```