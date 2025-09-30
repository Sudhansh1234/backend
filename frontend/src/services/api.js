import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.message || 'An error occurred'
    toast.error(message)
    
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    return response.data
  },
  
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`)
    return response.data
  },
  
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  }
}

export const taskAPI = {
  getTasks: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters })
    const response = await api.get(`/tasks?${params}`)
    return response.data
  },
  
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`)
    return response.data
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },
  
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData)
    return response.data
  },
  
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`)
    return response.data
  },
  
  getAllTasks: async (page = 1, limit = 10) => {
    const response = await api.get(`/tasks/admin/all?page=${page}&limit=${limit}`)
    return response.data
  }
}

export default api

