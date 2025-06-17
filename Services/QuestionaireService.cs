using LifeTracker.Models;
using Microsoft.AspNetCore.Components;

namespace LifeTracker.Services;

public static class QuestionaireService
{
    static List<Questionaire> Questionaires { get; } = new List<Questionaire>();
    static QuestionaireService()
    {
    }

    public static List<Questionaire> GetAll() => Questionaires;

}