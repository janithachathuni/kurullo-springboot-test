// OAuth2Success.jsx 

import React, { useEffect } from 'react'

const OAuth2Success = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const role = params.get('role')
    const isFirstLogin = params.get('isFirstLogin') === 'true'
    const profileCompleted = params.get('profileCompleted') === 'true'

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)

      if (isFirstLogin || !profileCompleted) {
        window.location.href = '/complete-profile'
      } else {
        window.location.href = '/dashboard'
      }
    }
  }, [])

  return (
    <div>
      <p>Logging you in...</p>
    </div>
  )
}

export default OAuth2Success