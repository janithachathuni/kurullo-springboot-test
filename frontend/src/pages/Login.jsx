// Login.jsx

import React, { useState } from 'react'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)

      if (data.isFirstLogin || !data.profileCompleted) {
        window.location.href = '/complete-profile'
      } else {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      <hr />

      <button onClick={handleGoogleLogin}>Login with Google</button>

      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  )
}

export default Login