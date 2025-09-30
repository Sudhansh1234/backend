import React, { createContext, useContext, useReducer } from 'react'
import { taskAPI } from '../services/api'
import toast from 'react-hot-toast'

const TaskContext = createContext()

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, pagination: action.payload.pagination, loading: false }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    case 'CLEAR_TASKS':
      return { ...state, tasks: [], pagination: null }
    default:
      return state
  }
}

const initialState = {
  tasks: [],
  pagination: null,
  loading: false,
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const fetchTasks = async (page = 1, limit = 10, filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await taskAPI.getTasks(page, limit, filters)
      dispatch({
        type: 'SET_TASKS',
        payload: {
          tasks: response.data.tasks,
          pagination: response.data.pagination
        }
      })
      return response.data
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const createTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData)
      dispatch({ type: 'ADD_TASK', payload: response.data })
      toast.success('Task created successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  }

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await taskAPI.updateTask(taskId, taskData)
      dispatch({ type: 'UPDATE_TASK', payload: response.data })
      toast.success('Task updated successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId)
      dispatch({ type: 'DELETE_TASK', payload: taskId })
      toast.success('Task deleted successfully!')
    } catch (error) {
      throw error
    }
  }

  const clearTasks = () => {
    dispatch({ type: 'CLEAR_TASKS' })
  }

  const value = {
    tasks: state.tasks,
    pagination: state.pagination,
    loading: state.loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearTasks,
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

