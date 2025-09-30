import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, taskAPI } from '../services/api'
import { Users, CheckSquare, Edit, Trash2, Shield, Mail, Calendar } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [usersPagination, setUsersPagination] = useState(null)
  const [tasksPagination, setTasksPagination] = useState(null)
  const [currentUsersPage, setCurrentUsersPage] = useState(1)
  const [currentTasksPage, setCurrentTasksPage] = useState(1)

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else {
      fetchAllTasks()
    }
  }, [activeTab, currentUsersPage, currentTasksPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await authAPI.getAllUsers(currentUsersPage, 10)
      setUsers(response.data.users)
      setUsersPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTasks = async () => {
    try {
      setLoading(true)
      const response = await taskAPI.getAllTasks(currentTasksPage, 10)
      setTasks(response.data.tasks)
      setTasksPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId, userData) => {
    try {
      await authAPI.updateUser(userId, userData)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-orange-600 bg-orange-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">You need admin privileges to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Manage users and monitor system activity</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Users ({usersPagination?.totalUsers || 0})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckSquare className="h-4 w-4 inline mr-2" />
            All Tasks ({tasksPagination?.totalTasks || 0})
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title={`Make ${user.role === 'admin' ? 'User' : 'Admin'}`}
                          >
                            <Shield className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Users Pagination */}
              {usersPagination && usersPagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentUsersPage(currentUsersPage - 1)}
                      disabled={!usersPagination.hasPrevPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentUsersPage(currentUsersPage + 1)}
                      disabled={!usersPagination.hasNextPage}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{usersPagination.currentPage}</span> of{' '}
                        <span className="font-medium">{usersPagination.totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentUsersPage(currentUsersPage - 1)}
                          disabled={!usersPagination.hasPrevPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentUsersPage(currentUsersPage + 1)}
                          disabled={!usersPagination.hasNextPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        {task.description && (
                          <p className="mt-1 text-gray-600">{task.description}</p>
                        )}
                        <div className="mt-3 flex items-center space-x-4">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            {task.userName}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {task.userEmail}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tasks Pagination */}
              {tasksPagination && tasksPagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentTasksPage(currentTasksPage - 1)}
                      disabled={!tasksPagination.hasPrevPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentTasksPage(currentTasksPage + 1)}
                      disabled={!tasksPagination.hasNextPage}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{tasksPagination.currentPage}</span> of{' '}
                        <span className="font-medium">{tasksPagination.totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentTasksPage(currentTasksPage - 1)}
                          disabled={!tasksPagination.hasPrevPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentTasksPage(currentTasksPage + 1)}
                          disabled={!tasksPagination.hasNextPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPanel

