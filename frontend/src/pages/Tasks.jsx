import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { getStatusColor, getPriorityColor, formatDate } from '../utils/helpers';

const Tasks = () => {
  const [filter, setFilter] = useState('all');

  // Mock tasks
  const tasks = [
    {
      id: 1,
      title: 'Update documentation',
      description: 'Update the API documentation with new endpoints',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignedTo: [{ name: 'John Doe' }],
    },
    {
      id: 2,
      title: 'Fix login bug',
      description: 'Resolve authentication issue on mobile',
      status: 'todo',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      assignedTo: [{ name: 'Jane Smith' }],
    },
    {
      id: 3,
      title: 'Design review',
      description: 'Review new dashboard designs',
      status: 'completed',
      priority: 'medium',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedTo: [{ name: 'John Doe' }],
    },
  ];

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <button className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" />
            New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <div className="flex space-x-2">
            {['all', 'todo', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === status
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <span className={`badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {task.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Due:</span>
                  <span className="text-gray-900">{formatDate(task.dueDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Assigned:</span>
                  <span className="text-gray-900">{task.assignedTo[0].name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
