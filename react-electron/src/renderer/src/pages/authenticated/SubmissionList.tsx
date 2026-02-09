import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { IQuestionnaire, ISubmission } from '../../api/types'

interface ISubmissionListProps {
  questionnaire: IQuestionnaire
}

export default function SubmissionList(props: ISubmissionListProps) {
  const { questionnaire } = props
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<ISubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        setError(null)
        const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5283'
        const response = await fetch(`${baseUrl}/submission/questionnaire/${questionnaire.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch submissions: ${response.statusText}`)
        }

        const data = await response.json()
        setSubmissions(data as ISubmission[])
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [questionnaire.id])

  const handleViewSubmission = (submissionId: number) => {
    navigate(`/questionnaire/${questionnaire.id}/submission/${submissionId}/question/0`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <h2>Submissions</h2>

        {loading && <p>Loading submissions...</p>}

        {error && (
          <div style={{ color: '#d32f2f', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        {!loading && submissions.length === 0 && !error && (
          <p>No submissions yet. <a href={`/questionnaire/${questionnaire.id}`}>Start a new submission</a></p>
        )}

        {!loading && submissions.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Total Points</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '0.75rem' }}>{formatDate(submission.date)}</td>
                  <td style={{ padding: '0.75rem' }}>{submission.totalPoints}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleViewSubmission(submission.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#646cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  )
}
