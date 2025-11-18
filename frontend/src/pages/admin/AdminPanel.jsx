import React from 'react';
import Layout from '../../components/layout/Layout';
import { FaUsers, FaTasks, FaNewspaper, FaChartLine } from 'react-icons/fa';

const AdminPanel = () => {
  const stats = [
    { label: 'Total Users', value: '124', change: '+12%', icon: FaUsers, color: 'blue' },
    { label: 'Active Tasks', value: '89', change: '+5%', icon: FaTasks, color: 'green' },
    { label: 'Total Posts', value: '342', change: '+24%', icon: FaNewspaper, color: 'purple' },
    { label: 'Engagement Rate', value: '87%', change: '+3%', icon: FaChartLine, color: 'orange' },
  ];

  const topPerformers = [
    { name: 'John Doe', tasksCompleted: 42, department: 'Engineering' },
    { name: 'Jane Smith', tasksCompleted: 38, department: 'Product' },
    { name: 'Bob Johnson', tasksCompleted: 35, department: 'Design' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor platform activity and user engagement</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
                <span className={`text-sm font-medium text-${stat.color}-600`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Top Performers */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performers</h2>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{performer.name}</h3>
                    <p className="text-sm text-gray-600">{performer.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    {performer.tasksCompleted}
                  </p>
                  <p className="text-xs text-gray-500">Tasks Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <button className="btn btn-primary">Add User</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">Employee</td>
                  <td className="px-6 py-4 whitespace-nowrap">Engineering</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary-600 hover:text-primary-900">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
