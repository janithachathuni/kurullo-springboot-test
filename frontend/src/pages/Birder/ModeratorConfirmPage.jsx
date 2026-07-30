import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';

const ModeratorConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/moderator-invite/confirm?token=${token}`,
          { method: 'POST' }
        );
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(`You're now a moderator. Thanks for confirming!`);
        } else {
          setStatus('error');
          setMessage(data.error || 'Something went wrong.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Something went wrong.');
      }
    };
    if (token) confirm();
    else { setStatus('error'); setMessage('Missing token.'); }
  }, [token]);

  const handleGoToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          {status === 'loading' ? (
            <div className="text-center">
              <p style={{ color: "var(--text-primary)" }}>Confirming your invitation...</p>
            </div>
          ) : status === 'error' ? (
            <div className="text-center">
              <p style={{ color: "var(--text-primary)" }}>{message}</p>
            </div>
          ) : (
            <div>
              {/* Congratulations Message */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Congratulations! You have been appointed as moderator for Kurullo.lk!
                </h1>
                <p className="text-lg" style={{ color: "var(--text-primary)" }}>
                  {message}
                </p>
              </div>

              {/* Moderator Duties */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Your Moderator Duties:
                </h2>
                <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Review and moderate user-generated content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Enforce community guidelines and rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Respond to user reports and flag inappropriate content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Help maintain a positive and safe community environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Collaborate with other moderators and administrators</span>
                  </li>
                </ul>
              </div>

              {/* OK Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGoToDashboard}
                  className="px-6 py-2.5 rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  OK - Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default ModeratorConfirmPage;