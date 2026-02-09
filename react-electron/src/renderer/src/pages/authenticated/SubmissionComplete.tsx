import React from 'react';
import { Link, useParams } from 'react-router';
import Layout from '../../components/Layout';

export default function SubmissionComplete() {
  const { id } = useParams();

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            animation: 'pulse 2s infinite',
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#333',
            marginBottom: '1rem',
          }}
        >
          Submission Complete!
        </h1>

        {/* Message */}
        <p
          style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '400px',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          Thank you for completing the questionnaire. Your answers have been saved successfully.
        </p>

        {/* Back Button */}
        <Link
          to={`/questionnaire/${id}/submission`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1em 2em',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#646cff',
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s',
            boxShadow: '0 4px 16px rgba(100, 108, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#535bf2';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(100, 108, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#646cff';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(100, 108, 255, 0.3)';
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Submissions
        </Link>

        {/* Decorative Elements */}
        <style>
          {`
            @keyframes pulse {
              0% {
                box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
              }
              50% {
                box-shadow: 0 8px 48px rgba(76, 175, 80, 0.5);
              }
              100% {
                box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
              }
            }
          `}
        </style>
      </div>
    </Layout>
  );
}
