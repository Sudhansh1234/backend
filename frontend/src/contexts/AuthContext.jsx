import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    case 'CLEAR_USER':
      return { ...state, user: null, loading: false }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

const initialState = {
  user: null,
  loading: true,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // Verify token by fetching user profile
          const response = await authAPI.getProfile()
          dispatch({ type: 'SET_USER', payload: response.data })
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          dispatch({ type: 'CLEAR_USER' })
        }
      } else {
        dispatch({ type: 'CLEAR_USER' })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.login(credentials)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      dispatch({ type: 'SET_USER', payload: response.data.user })
      
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.register(userData)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      dispatch({ type: 'SET_USER', payload: response.data.user })
      
      toast.success('Registration successful!')
      return response.data
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'CLEAR_USER' })
    toast.success('Logged out successfully!')
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      const updatedUser = response.data
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
      
      toast.success('Profile updated successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  }

  const value = {
    user: state.user,
    loading: state.loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

