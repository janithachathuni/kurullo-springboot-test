// OAuth2Success.jsx 

import React, { useEffect } from 'react'

const OAuth2Success = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
const token = params.get('token')
const userId = params.get('userId')
const role = params.get('role')
const username = params.get('username')
const isFirstLogin = params.get('isFirstLogin') === 'true'
const profileCompleted = params.get('profileCompleted') === 'true'

if (token) {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
  localStorage.setItem('user', JSON.stringify({ id: Number(userId), username, role }))
  localStorage.setItem('user', JSON.stringify({ username, role }))  // add this

  if (role === 'ADMIN') {
    window.location.href = '/admin/dashboard'
  } else if (isFirstLogin || !profileCompleted) {
    window.location.href = '/create-profile'
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