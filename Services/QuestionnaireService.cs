using LifeTracker.Models;
using Microsoft.AspNetCore.Components;

namespace LifeTracker.Services;

public static class QuestionnaireService
{
    static List<Questionnaire> Questionnaires { get; } = new List<Questionnaire>();
    static QuestionnaireService()
    {
    }

    public static List<Questionnaire> GetAll() => Questionnaires;

    public static Questionnaire? Get(int QuestionnaireId) => Questionnaires.FirstOrDefault(x => x.Id == QuestionnaireId);

}