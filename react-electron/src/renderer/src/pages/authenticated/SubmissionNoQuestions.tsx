import React from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Layout from '../../components/Layout'

export default function SubmissionNoQuestions() {
  const navigate = useNavigate()
  const { id, templateId } = useParams()

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault()
            navigate(`/questionnaire/${id}/submission`)
          }}
          style={{
            color: '#646cff',
            textDecoration: 'none',
          }}
        >
          ← Back
        </Link>
        <h2>No Questions Available</h2>
        <p>No questions available for this Questionnaire. Please create them in the latest template.</p>
        <Link
          to={`/questionnaire/${id}/edit/template/${templateId}/question`}
          style={{
            color: '#646cff',
            textDecoration: 'none',
            marginTop: '1rem',
            display: 'inline-block',
          }}
        >
          Go to Template Questions
        </Link>
      </div>
    </Layout>
  )
}
