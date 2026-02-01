import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, useParams } from 'react-router'
import { apiGetSubmission } from '../../api/apiSubmission'
import { apiGetQuestions } from '../../api/apiQuestion'

export default function SubmissionQuestion() {
  const { id, submissionId, questionIndex } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    
    // Fetch question data here
    const fetchQuestionData = async () => {
      const submission = await apiGetSubmission(submissionId ? parseInt(submissionId, 10) : 0)
      console.log(submission);
      if (!submission) {
        throw new Error('Failed to load submission');
      }
      // use templateId to get questions
      const questions = await apiGetQuestions(submission.templateId);
      console.log(questions);
      if (!questions || questions.length === 0) {
        // Redirect to no questions page
        navigate(`/questionnaire/${id}/submission/${submissionId}/noquestions`);
        return;
      }
      const qIndex = questionIndex ? parseInt(questionIndex, 10) : 0;
      if (qIndex < 0 || qIndex >= questions.length) {
        throw new Error('Question index out of bounds');
      }
      const question = questions[qIndex];
      console.log('Current Question:', question);
    }
    fetchQuestionData();
  }, [])
  return (
    <Layout>SubmissionQuestion</Layout>
  )
}
