import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TaskContext'
import { CheckSquare, Clock, AlertCircle, TrendingUp, Users } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { tasks, fetchTasks, loading } = useTasks()

  useEffect(() => {
    fetchTasks(1, 5) // Fetch first 5 tasks for dashboard
  }, [fetchTasks])

  const getStatusCounts = () => {
    const counts = { pending: 0, in_progress: 0, completed: 0 }
    tasks.forEach(task => {
      counts[task.status]++
    })
    return counts
  }

  const getPriorityCounts = () => {
    const counts = { low: 0, medium: 0, high: 0 }
    tasks.forEach(task => {
      counts[task.priority]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()
  const priorityCounts = getPriorityCounts()

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks.length,
      icon: CheckSquare,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending',
      value: statusCounts.pending,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      name: 'In Progress',
      value: statusCounts.in_progress,
      icon: AlertCircle,
      color: 'bg-orange-500'
    },
    {
      name: 'Completed',
      value: statusCounts.completed,
      icon: TrendingUp,
      color: 'bg-green-500'
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-orange-600 bg-orange-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? '...' : stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(priority)}`}>
                    {priority}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/tasks"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckSquare className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">View All Tasks</h4>
              <p className="text-sm text-gray-500">Manage your task list</p>
            </div>
          </a>
          
          <a
            href="/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Update Profile</h4>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </a>

          {user?.role === 'admin' && (
            <a
              href="/admin"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Admin Panel</h4>
                <p className="text-sm text-gray-500">Manage users and tasks</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

