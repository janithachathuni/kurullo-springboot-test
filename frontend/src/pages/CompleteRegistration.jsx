// CompleteRegistration.jsx

import React, { useState, useEffect } from 'react'

const CompleteRegistration = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [googleId, setGoogleId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('email') || '')
    setGoogleId(params.get('googleId') || '')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:8080/api/auth/complete-google-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, googleId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = '/login'
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Complete Registration</h2>
      <p>Welcome! Just pick a username to finish setting up your account.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          disabled
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  )
}

export default CompleteRegistration