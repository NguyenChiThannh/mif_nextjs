import { useEffect, useState } from 'react'

export const useGetRole = () => {
  const [role, setRole] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user role')
        }

        const responseData = await response.json()
        setRole(responseData?.role?.value || null)
      } catch (err) {
        console.error('Error fetching user role:', err)
        setError(err.message)
        setRole(null)
      }
    }

    fetchRole()
  }, [])

  return { role, error }
}
